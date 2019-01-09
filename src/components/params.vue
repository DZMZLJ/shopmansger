<template>
 <el-card class="card">
  <!-- 面包屑 -->
  <my-bread level1="商品管理" level2="分类参数"></my-bread>
  <el-alert class="alert" title="注意：只允许给三级参数添加商品" type="warning" center show-icon :closable="false"></el-alert>
  <el-form :model="form" class="form" label-posidion="left">
  <el-form-item label="请选择商品分类">
		<el-cascader
      :show-all-levels="false"
			clearable
  	  expand-trigger="hover"
  	  :options="options"
  	  v-model="selectedOptions"
			:props="defaultProp"
      @change="changeSelectoption()">
  	</el-cascader>
	</el-form-item>
  </el-form>
  <!-- 动态，静态tabs -->
  <el-tabs type="border-card" v-model="active" @tab-click="changeTab()">
    <el-tab-pane name="1" label="动态参数">
      <!-- 动态按钮 -->
      <el-button type="primary" :disabled="selectedOptions.length===0">设置动态参数</el-button>
      <!-- 表格 -->
      <el-table height="300px" border stripe :data="arrDy" style="width: 100%">
        <el-table-column type="expand" width="200">
        <template slot-scope="scope">
          <!-- 动态el-tag编辑 -->
            <el-tag
              :key="item.attr_id"
              v-for="(item,i) in scope.row.attr_vals"
              closable
              :disable-transitions="false"
              @close="handleClose(scope.row,item)">
              {{item}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="200"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
        <el-table-column label="操作" width="300">
        <template slot-scope="scope">
        <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="2" label="静态参数">
      <!-- 静态按钮 -->
      <el-button type="primary" :disabled="selectedOptions.length===0">设置静态参数</el-button>
      <el-table height="300px" border stripe :data="arrStatic" style="width: 100%">
        <el-table-column type="index" label="#" width="200"></el-table-column>
        <el-table-column prop="attr_name" label="属性值名称" width="200"></el-table-column>
        <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>
        <el-table-column label="操作" width="300">
        <template slot-scope="scope">
        <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
 </el-card>
</template>

<script>
export default {
  data() {
    return {
      form:{
        
      },
      options:[],
      selectedOptions:[],
      defaultProp: {
				label: "cat_name",
				value: "cat_id",
				children: "children"
			},
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态编辑tag的数据
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async handleClose(attr,item) {
        // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        attr.attr_vals.splice(attr.attr_vals.indexOf(item),1);
        // console.log(attr.attr_vals);
        const putData = {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(",")
        }
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
        // console.log(res);
        
      },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        // 发送编辑请求
        const putData = {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(",")
        }
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
        // console.log(res);

      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 选中Tab触发
    changeTab(){
       if(this.selectedOptions.length === 3 && this.active === "1") {
        this.getDyparams();
      }
      if(this.selectedOptions.length === 3 && this.active === "2") {
        this.getStaticparams();
      }
    },
    // 选中级联选择器(请选择商品分类)
    changeSelectoption(){
      // 判断是否是三级 是否是第一个TAB
      if(this.selectedOptions.length === 3 && this.active === "1") {
        this.getDyparams();
      }
      if(this.selectedOptions.length === 3 && this.active === "2") {
        this.getStaticparams();
      }
    },
    // 获取静态参数
    async getStaticparams(){
      const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
      this.arrStatic = res.data.data;
      // console.log(this.arrStatic);
    },
    // 获取动态参数
    async getDyparams(){
      // 发送请求
      const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
      this.arrDy = res.data.data;
      // console.log(this.arrDy);
      
      this.arrDy.forEach(item=> {
        // item.attr_vals = item.attr_vals.split(",");
        item.attr_vals = item.attr_vals.trim().length===0?[]:item.attr_vals.trim().split(",");
      })
    },
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
.el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
