<template>
  <div style="height: 100%" class="home-main">
    <div class="home-main-left">
        <div>
          <img @click="goToMain" :src="itestPng" class="home-main-left-image"/>
        </div>

      <div>
        <div class="home-color home-main-left-menu-type">
          接口测试
        </div>
        <div id="home-main-menu">
          <el-menu
              :default-active="defaultActive"
              background-color="#354052"
              text-color="#fff"
              @select="handleSelect"
              class="el-menu-vertical-demo">
            <el-menu-item index="service">
              <i class="el-icon-menu"></i>
              <span slot="title">模块管理</span>
            </el-menu-item>
            <el-menu-item index="interface">
              <i class="el-icon-document"></i>
              <span slot="title">用例管理</span>
            </el-menu-item>
            <el-menu-item index="task">
              <i class="el-icon-setting"></i>
              <span slot="title">任务管理</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>

    </div>

    <div class="home-main-right">
      <div class="home-main-right-menu">
        <div class="home-main-right-menu-title">
          {{activeName}}
        </div>

        <div class="home-main-right-menu-user">
          <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link" style="font-size: 18px">
            {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user" command="tui">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="home-main-right-context">
        <router-view :projectId="projectId"/>
      </div>

      <div class="home-main-right-foot">
        2021 © XXX科技 - zhuxiaoqin.com
      </div>

    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import {getUserInfo, logout} from "../request/user";
import itest from "../assets/itest.png"

export default {
  name: 'Home',
  data() {
    return {
      itestPng:itest,
      user:{},
      projectId:undefined,
      defaultActive:"service",
      activeName:"模块"
    }
  },
  components: {
  },
  methods:{
    goToMain(){
      this.$router.push('/');
    },
    getUserInfo(){
      getUserInfo().then(rsp=>{
            let success = rsp.data.success
            this.user = rsp.data.data;
            if (false===success){
              this.$router.push('/login');
            }
          }).catch(
          ()=>{this.$router.push('/login');}
          )
    },
    handleSelect(key){
      this.$router.push('/main/'+ key + "/?projectId="+this.projectId);
      switch (key){ //处理右边顶部标题的展示
        case 'service':
          this.activeName="模块";
          break;
        case 'interface':
          this.activeName="接口";
          break;
        case 'task':
          this.activeName="任务";
          break;
      }
    },
    Logout(){
      logout().then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.$router.push('/login')
        }
      }).catch(()=>{
      })
    },
    handleCommand(command) {
      if (command == "tui"){
        this.Logout()
      }
    }
  },
  created() {
    this.getUserInfo()
    this.projectId = this.$route.query.projectId
    if(undefined==this.projectId || this.projectId==""){
      this.$router.push('/')
      //解决菜单刷新后，会重新定位到默认菜单"模块管理service"
    }
    if(-1 !== this.$route.path.indexOf("interface")){ //获取当前url，并检索是否含有interface字符串，indexOf不含该字符串返回-1
      this.activeName="接口";
      this.defaultActive = "interface"
    }
    if(-1 !== this.$route.path.indexOf("task")){
      this.activeName="任务";
      this.defaultActive = "task"
    }
    if(-1 !== this.$route.path.indexOf("service")){
      this.activeName="模块";
      this.defaultActive = "service"
    }
  }
}

</script>


<style>
.home-main{
  display: flex;
  justify-content: normal;
}
.home-main-left{
  flex:0 1 260px; /*这里代表固定宽度260px,宽度不会自动延伸，但是高度自动延伸*/
  background: #354052;
}
.home-main-right{
  flex: 1 1 auto; /*这里代表自动宽度，宽度自动延伸，高度自动延伸*/
  display: flex;
  flex-direction: column;
}
.home-main-left-image{
  width: 85px;
  margin: 20px auto;
  cursor: pointer;
}
.home-color{
  color: #cedce4;
}
.home-main-left-menu-type{
  font-size: 12px;
  text-align: left;
  margin-left:30px;
}
#home-main-menu .el-menu-item {
  text-align: left;
}
#home-main-menu i {
  margin-left: 10px;
}
.home-main-right-menu {
  display: flex;
  height: 50px;
  width: 100%;
}
.home-main-right-menu-title {
  flex: 1 1 auto;
  text-align: left;
}
.home-main-right-menu-user {
  flex: 0 1 100px;
  padding: 10px 5px 5px 5px;
  background-color: #fafbfd;
}
.home-main-right-foot {
  height: 35px;
  text-align: left; /*靠左*/
  padding-left: 40px; /*距离左右40px*/
  color: #98a6ad;
  padding-top: 15px;
  border-top: 1px solid rgba(152,166,173,.2);
}
.home-main-right-context {
  width: 100%;
  flex: 1 1 auto; /*上下自动延伸*/
  box-sizing: border-box;
  overflow: auto;
}
</style>