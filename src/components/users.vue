<template>
<el-card class="card">
    <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索添加用户 -->
   <el-row>
     <el-col>
      <el-input clearable @clear="getAllUsers()" placeholder="请输入用户名" v-model="query" class="input-with-select">
      <el-button @click="searchUser()"
      slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="showDiaAdd()">添加用户</el-button>
     </el-col>
   </el-row>
  <!-- 内容表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
      <el-table-column label="创建日期" width="150">
        <template slot-scope="scope">
          {{scope.row.create_time|fmtDate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch> 
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" circle @click="showDiaEdit(scope.row)"></el-button>
          <el-button type="danger"  size="mini" plain icon="el-icon-delete" circle
          @click="showDeleConfig(scope.row)"></el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check" circle
          @click="showRoleDia(scope.row)"></el-button>
         </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  <!-- 对话框 -->
<el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑按钮弹出对话框 -->
<el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input disabled v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 分配角色 --> 
<el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form>
    <el-form-item label="用户名" :label-width="formLabelWidth">
      {{currUsername}}
    </el-form-item> 
    <el-form-item label="角色" :label-width="formLabelWidth">
      <el-select v-model="currRoleId">
        <el-option disabled label="请选择" :value="-1"></el-option>
        <el-option v-for="(v,i) in roles" :key="i" 
        :label="v.roleName" :value="v.id"> 
        </el-option>
      </el-select>
    </el-form-item> 
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="setRole()">确 定</el-button>
  </div>
</el-dialog>
</el-card>
</template> 

<script>
export default {
  data() { 
    return {
      query: "",
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 控制对话框显示和隐藏
      dialogFormVisibleAdd:false,
      dialogFormVisibleEdit:false,
      dialogFormVisibleRole:false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      currRoleId: -1,
      // 角色数据
      roles: [],
      currUsername: "",
      currUserId: -1

    };
  },
  created() { 
    this.getTableData();
  },
  methods: {
    // 点击分配角色（对号）发送请求
    async setRole(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
        rid: this.currRoleId
      });
      this.dialogFormVisibleRole = false;
      // console.log(res); 
    },
    // 点击分配角色（对号）按钮弹出对话框
    async showRoleDia(user){
      this.currUsername = user.username;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {meta:{msg,status},data} = res.data;
      if (status === 200){
        this.roles = data;
      }
      // 根据用户id查询用户获取当前角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.currRoleId = res2.data.data.rid;
      

      
    },
    // 改变用户状态
    async changeState(user){
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      // console.log(res);
      this.$message.success(msg);
      
    },
    // 发送编辑按钮请求
    async editUser(){
      const res = await this.$http.put(`users/${this.form.id}`,this.form);
      console.log(res);
      const {meta:{msg,status}} = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 刷新页面
         this.getTableData();
      } else {
        this.$message.warning(msg);
      }
      
    },
    // 点击编辑按钮弹出对话框
    async showDiaEdit(user){
      this.dialogFormVisibleEdit = true;
      // 获取当前编辑的数据
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res);
      const {meta:{msg,status},data} = res.data;
      if (status === 200){
        this.form = data;
      }
    },
    // 点击删除按钮弹出对话框
    showDeleConfig(user){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除按钮请求
            const res = await this.$http.delete(`users/${user.id}`);
            // console.log(res);
            const {meta:{msg,status}} = res.data;
            if (status === 200) {
              this.$message.success('删除成功!');
              this.pagenum = 1;
              this.getTableData();
            } else {
              this.$message.warning(msg)
            }
            
        }).catch(() => {
          this.$message.info('已取消删除');       
        });
    },
    // 添加用户中的发送请求
    async addUser(){
      const res = await this.$http.post(`users`,this.form);
      // console.log(res);
      const {meta:{msg,status}} = res.data;
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
      //  刷新表格
        this.getTableData();
        // 提示信息
        this.$message.success(msg); 
      } else {
        this.$message.warning(msg); 
      }
      
    },
    // 点击添加用户按钮打开对话框
    showDiaAdd(){
      // 清空对话框
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 点击X获取所有用户
    getAllUsers(){
      this.getTableData();
    },
    // 搜索方法
    searchUser(){
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关方法
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagenum = 1;
        this.pagesize = val;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        this.getTableData();
        console.log(`当前页: ${val}`);
      },
    // 获取用户数据列表
    async getTableData(){
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`); 
      // console.log(res);
      const {
        meta:{status,msg},
        data:{total,users}
        } = res.data;
        if(status === 200) {
          this.tableData = users;
          // console.log(this.tableData);
          this.total = total;
          this.$message.success(msg);
        } else {
          this.$message.warning(msg);
        }
    }
  },
};
</script>

<style>
.card{
    height: 100%;
}
.input-with-select{
  width: 400px;
  margin-top: 20px;
}
</style>
