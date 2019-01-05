<template>
<el-container class="container">
  <el-header class="header">  
    <el-row>
        <el-col :span="3"><div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片无法显示"></div></el-col>
        <el-col :span="19" class="middle"><div class="grid-content bg-purple-light">
            <h2>电商后台管理</h2></div></el-col>
        <el-col :span="1" class="loginout"><div class="grid-content bg-purple">
            <a href="#" @click.prevent = "handleLoginout()">退出</a>
            </div></el-col>
    </el-row>
  </el-header>
    <el-container>
    <el-aside width="200px" class="aside">
      <el-menu router unique-opened default-active="2">
        <el-submenu :index="''+item1.order" v-for="(item1,i) in menus":key="item1.id">
          <template slot="title">
            <i class="el-icon-location"></i> <span>{{item1.authName}}</span>
          </template>
          <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="item2.id">
          <i class="el-icon-success"></i> {{item2.authName}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
    </el-container>
</el-container>
</template>

<script> 
export default {
    // 判断如果没有token则不渲染页面返回登录页面
    beforeCreate(){
      // if(!localStorage.getItem('token')){
      //   this.$message.warning('请先登陆！')
      //   this.$router.push({
      //   name: 'login'
      //   });
      // }
    },
    created() {
      this.getMenus();
    },
    data() {
      return {
        menus: []
      }
    },
    methods: {
      // 获取导航数据
      async getMenus(){
        const res = await this.$http.get(`menus`);
        // console.log(res);
        this.menus = res.data.data; 
      },
      // 退出功能
      handleLoginout() {
        // 清除token
        localStorage.clear();
        // 返回登录页
        this.$router.push({
            name: 'login'
        });
        this.$message.success("退出成功！");
      }
    },
}
</script>

<style>
.container{

}
.container .header{
    background-color: #b3c0d1; 
}
.container .aside{

}
.container .main{

}
.middle{
    text-align: center;
    color: #fff;
    line-height: 60px;
}
.loginout a{
    text-decoration: none;
    line-height: 60px;
}
</style>