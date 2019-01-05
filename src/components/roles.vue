<template>
 <el-card class="card" >
  <!-- 面包屑 -->
  <my-bread level1="权限管理" level2="角色列表"></my-bread>
  <!-- 添加角色按钮 -->
   <el-row>
    <el-col>
      <el-button class="btn" type="success" @click="showDiaAdd()">添加角色</el-button>
    </el-col>
  </el-row>
  <!-- 表格 -->
  <el-table class="table" :data="rights" style="width: 100%">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag class="leve1" closable
              @close="deleRights(scope.row,item1)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row type="success" v-for="(item2,i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag class="leve2" type="success" closable @close="deleRights(scope.row,item2)">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRights(scope.row,item3)" class="leve3" type="info" closable v-for="(item3,i) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col><span>该角色尚未分配任何权限</span></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="250"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
        <el-button type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
        <el-button @click="showDiaRights(scope.row)"
        type="success" size="mini" plain icon="el-icon-check" circle></el-button>
       </template>
      </el-table-column> 
  </el-table>
  <!-- 分配权限对话框 -->
  <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
    <!-- 树形结构 -->
    <el-tree
    ref="tree"
    :data="treeData"
    show-checkbox
    node-key="id" 
     default-expand-all
    :default-checked-keys="checkedArr"
    :props="defaultProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setRights()">确 定</el-button>
    </span>
  </el-dialog>
 </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      rights: [],
      treeData: [],
      // 树形结构配置选项
      defaultProps:{
        label: "authName",
        children: "children"
      },
      expandedArr: [],
      checkedArr: [],
      currRoleId: -1
    }
  },
  created() {
    this.getRoles();
  }, 
  methods: {
    // 点击分配权限按钮（对号）发送请求
  async setRights(){
      // 获取全选节点Id
      const arr1 = this.$refs.tree.getCheckedKeys();
      // console.log(arr1); 
      // 获取半选节点id
       const arr2 = this.$refs.tree.getHalfCheckedKeys();
        // console.log(arr2); 
        const arr = [...arr1, ...arr2];
      // 发送请求
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{
        rids: arr.join(",")
      });
      // 关闭对话框
      this.dialogVisible = false;
      // 刷新页面
      this.getRoles();
    },
    // 点击分配权限按钮（对号）弹出对话框
    async showDiaRights(role){
      this.currRoleId = role.id;
      // console.log(role);
      
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.treeData = res.data.data;
      const tempArr = [];
      role.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      // console.log(tempArr);
      this.checkedArr = tempArr;
      
      this.dialogVisible = true;

    },
    // 取消权限 
    async deleRights(role,rights){
      // console.log(rights);
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      // console.log(res);
      // 更新当前角色权限
      // this.getRoles();
      role.children = res.data.data;
    },
    async getRoles(){
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.rights = res.data.data; 
      // console.log(this.rights);
      
    }
  },
}
</script>

<style>
.card{
  height: 100%;
}
.btn{
  margin-top: 20px;
}
.leve1,.leve2,.leve3{
  margin-top: 8px;
}
.leve3{
  margin: 6px;
}
</style>
