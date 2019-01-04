<template>
  <div class="wrap">
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h3>用户登录</h3>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin()" type="primary" class="btn" >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin(){
    const res = await this.$http.post("login",this.formdata)
    // console.log(res);
    const {data:{meta:{msg,status},data}} = res;
        if (status === 200){
          // alert(msg)
          // 保存token值
          localStorage.setItem("token",data.token)
          this.$message.success(msg)
          // 渲染home.vue 该标识
          this.$router.push({
            name:'home'
          });
        } else {
          // alert(msg)
          this.$message.warning(msg)
        }
    }
  },
  // mounted() {
  //   console.log(this.$http);  
  // },
};
</script>

<style>
.wrap{
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap .form{
  background-color: #fff;
  border-radius: 10px;
  width: 400px;
  padding: 30px;
}
.wrap .form .btn {
  width: 100%;
}  
</style>
