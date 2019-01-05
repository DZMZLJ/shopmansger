<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
  <el-table class="table" :data="roles" height="500px" style="width: 100%">
      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="250"></el-table-column>
      <el-table-column label="层级" width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column> 
  </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const res = await this.$http.get(`rights/list`);
      console.log(res);
      this.roles = res.data.data; 
    }
  },
}
</script>

<style>
.card{
    height: 100%;
}
.table{
  margin-top: 20px;
}
</style>
