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
        <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
            <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                角色列表
            </el-menu-item>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                商品列表
            </el-menu-item>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                分类参数
            </el-menu-item>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
            <el-menu-item index="1-3">
                <i class="el-icon-menu"></i>
                订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
            <el-menu-item index="1-3">
                <i class="el-icon-tickets"></i>
                数据报表
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
        if(!localStorage.getItem('token')){
            this.$message.warning('请先登陆！')
            this.$router.push({
                name: 'login'
            });
        }
    },
    methods: {
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