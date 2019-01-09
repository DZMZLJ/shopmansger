<template>
  <el-card class="card" >
		<!-- 面包屑 -->
    <my-bread level1='商品管理' level2='商品列表'></my-bread>
		<!-- 消息提示框  -->
		<el-row class="alert">
			<el-col>
				<el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
			</el-col>
		</el-row>
		<!-- 步骤条 -->
		<el-steps :active="1*active" align-center>
			<el-step title="基本信息"></el-step>
  		<el-step title="商品参数"></el-step>
  		<el-step title="商品属性"></el-step>
  		<el-step title="商品图片"></el-step>
  		<el-step title="商品内容"></el-step>
		</el-steps>
		<!-- tabs标签页（左侧竖形列表） -->
		<el-form :model="form" class="form" label-posidion="top">
			<el-tabs tab-position="left" v-model = "active" @tab-click="changeTab()">
			<el-tab-pane name = "1" label="基本信息">
				<el-form-item label="商品名称">
					<el-input v-model="form.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品价格">
					<el-input v-model="form.goods_price"></el-input>
				</el-form-item>
				<el-form-item label="商品重量">
					<el-input v-model="form.goods_weight"></el-input>
				</el-form-item>
				<el-form-item label="商品数量">
					<el-input v-model="form.goods_number"></el-input>
				</el-form-item>
				<el-form-item label="商品分类">
					<el-cascader
						clearable
  				  expand-trigger="hover"
  				  :options="options"
  				  v-model="selectedOptions"
						:props="defaultProp"
  				  @change="handleChange">
  				</el-cascader>
				</el-form-item>
			</el-tab-pane>
    	<el-tab-pane name = "2" label="商品参数">
        <!-- 复选框 -->
				<el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
					  <el-checkbox-group v-model="item1.attr_vals">
    				<el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i"
            :label="item2"></el-checkbox>
  					</el-checkbox-group>
				</el-form-item>
			</el-tab-pane>
    	<el-tab-pane name = "3" label="商品属性">
        <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id" >
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
    	<el-tab-pane name = "4" label="商品图片">
        <el-form-item>
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
						:on-success="handlesuccess"
						:headers="headers"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-tab-pane>
    	<el-tab-pane name = "5" label="商品内容">
				<el-form-item>
					<!-- 添加商品按钮 -->
					<el-button type="primary" @click="addGoods()">添加商品</el-button>
					<!-- 富文本编辑器 -->
						<quill-editor class="editor" v-model="form.goods_introduce"></quill-editor>
				</el-form-item>
			</el-tab-pane>
  		</el-tabs>
		</el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 局部引入
import {quillEditor} from 'vue-quill-editor'
export default {
	components: {
		quillEditor
	},
	data() {
		return {
			active: "1",
			form: {
				goods_name: "",
				goods_price: "",
				goods_weight: "",
				goods_number: "",
				goods_introduce: "",
				goods_cat: "",
				pics: [],
				attrs: ""
			},
			// 级联选择器所需选择器
			options: [],
			selectedOptions: [1,3,6],
			defaultProp: {
				label: "cat_name",
				value: "cat_id",
				children: "children"
			},
			// checkList: [],
			// 动态参数数组
      arrDy: [],
      // 静态参数数组
			arrStatic: [],
			headers:{
				Authorization:localStorage.getItem("token")
			}
		}
	},
	created() {
		this.getGoodsCate();
	},
	methods: {
		// 添加商品按钮
		async addGoods(){
			// 三级分类id
			this.form.goods_cat = this.selectedOptions.join(",");
			// 动态参数数组
			const arr1 = this.arrDy;
			const arr1New = arr1.map((item)=>{
				return {arrt_id:item.attr_id,attr_value:item.attr_vals}
			});
			// console.log(arr1New);
			// 静态参数数组
			const arr2 = this.arrStatic;
			const arr2New = arr2.map((item)=>{
				return {arrt_id:item.attr_id,attr_value:item.attr_vals}
			});
			// console.log(arr2New);
			// 合并数组
			const arr = [...arr1New,...arr2New];
			this.form.attrs = arr;
			// console.log(this.form.attrs);
			const res = await this.$http.post(`goods`,this.form);
			// console.log(res);
			this.$router.push({
				name:"goods"
			})
			
		},
		// 图片上传的钩子函数
		// 移除图片自动触发
		handleRemove(file){
			// console.log("移除成功");
			// console.log(file);
			const index = this.form.pics.findIndex(item => {
				return item.pic === file.response.data.tmp_path;
			});
			this.form.pics.splice(index,1);
			// console.log(this.form.pics);
			
			// file.response.data.tmp_path	
		},
		handlesuccess(response){
			// console.log("上传成功");
			// console.log(response);
			this.form.pics.push({
				pic:response.data.tmp_path	
			})
			// response.data.tmp_path	
			// console.log(this.form.pics);
			
		},
		// 选中Tab(左边按钮)触发
		async	changeTab(){
			// 判断是否是第二个按钮
			if (this.active === "2"){
				// 判断三级分类有么
				if (this.selectedOptions.length === 3){
					// 发送请求
					const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
					this.arrDy = res.data.data;
					// console.log(this.arrDy);
					this.arrDy.forEach(item=> {
            // item.attr_vals = item.attr_vals.split(",");
            item.attr_vals = item.attr_vals.trim().length===0?[]:item.attr_vals.trim().split(",");
          });
				} else {
					this.$message.warning("请选择三级分类商品");
				}
      }
      // 判断是否是第三个按钮
      if (this.active === "3"){
        if (this.selectedOptions.length === 3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
					this.arrStatic = res.data.data;
        } else {
          this.$message.warning("请选择三级分类商品");
        }
      }
		},
		handleChange(){

		},
		// 获取级联选择器三级分类数据
		async getGoodsCate(){
			const res = await this.$http.get(`categories?type=3`);
			// console.log(res);
			this.options = res.data.data;
		}
	},
}
</script>

<style>
.card{
    height: 100%;
}
.alert{
	margin-top: 20px;
	margin-bottom: 20px;
}
.form{
	height: 300px;
	overflow: auto;
}
.editor{
	margin-top: 20px;
}
.ql-editor{
	min-height:200px;
}
</style>