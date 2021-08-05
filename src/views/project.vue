<template>
  <div style="height: 100%" class="home-main">
    <div class="home-main-left">
      <div>
        <img @click="goToMain" :src="itestPng" class="home-main-left-image"/>
      </div>
      <div>
        <div class="home-color home-main-left-menu-type">
          测试平台
        </div>
        <div id="home-main-menu">
          <el-menu
              :default-active="defaultActive"
              background-color="#354052"
              text-color="#fff"
              @select="handleSelect"
              class="el-menu-vertical-demo">
            <el-menu-item index="Automation">
              <i class="el-icon-menu"></i>
              <span slot="title">自动化接口项目管理</span>
            </el-menu-item>
            <el-menu-item index="testTool">
              <i class="el-icon-setting"></i>
              <span slot="title">测试工具</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>

    </div>


    <div class="home-main-right">
      <div class="home-main-right-menu">
        <div class="home-main-right-menu-title">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>InterfaceTest</el-breadcrumb-item>
            <el-breadcrumb-item>项目</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="home-main-right-menu-user">
          <el-dropdown>
          <span class="el-dropdown-link" style="font-size: 18px">
            {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="home-main-right-context">
        <el-button type="primary" plain @click="openAddProjectDialog">创建项目</el-button>
        <el-table
            :data="projectList"
            :header-cell-style="{'color':'#555555'}"
            stripe
            style="width: 100%">
          <el-table-column
              prop="name"
              label="名称"
              min-width="20%">
            <template slot-scope="scope">
              <a :href="mainPath+ scope.row.id" style="color: #409EFF; text-decoration: none">{{scope.row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              label="描述"
              min-width="30%">
          </el-table-column>
          <el-table-column
              prop="status"
              label="状态"
              min-width="20%">
            <template slot-scope="scope">
              <span v-if="1 == scope.row.status"><el-tag>正常</el-tag></span>
              <span v-else><el-tag type="info">已关闭</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="创建时间"
              min-width="20%">
          </el-table-column>
          <el-table-column
              prop="ops"
              label="操作"
              min-width="10%">
            <template slot-scope="scope">
              <el-button @click="openeditProjectDialog(scope.row)" type="text" size="small">编辑</el-button> <!--scope.row相当于当前行的数据对象-->
              <el-button @click="deleteProject(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="home-main-right-foot">
        2021 © XXX科技 - zhuxiaoqin.com
      </div>

      <el-dialog title="创建项目" :visible.sync="addProjectDialogVisible">
        <el-form :model="addProjectForm" :rules="addProjectRule" ref="addProjectFormm">
          <el-form-item label="名称" label-width="100px" prop="name">
            <el-input v-model="addProjectForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="100px" prop ="description">
            <el-input type="textarea" :rows="2" v-model="addProjectForm.description" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addProjectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProjectConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑项目" :visible.sync="editProjectDialogVisible">
        <el-form :model="editProjectForm" :rules="editProjectRule" ref="editProjectFormm">
          <el-form-item label="名称" label-width="100px" prop="name">
            <el-input v-model="editProjectForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="100px" prop ="description">
            <el-input type="textarea" :rows="2" v-model="editProjectForm.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="100px" prop ="status">
            <div style="text-align: left;">
              <el-radio v-model="editProjectForm.status" :label="1">正常</el-radio>
              <el-radio v-model="editProjectForm.status" :label="2">已关闭</el-radio>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editProjectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editProjectConfirm">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import {getUserInfo} from "../request/user";
import itest from "../assets/itest.png"
import {createProject, deleteProject, getProjectList, updateProject} from "../request/project";

export default {
  name: 'project',
  data() {
    return {
      itestPng:itest,
      user:{},
      mainPath:"/main/service/?projectId=", //由于跳转到main页面默认在模块菜单，所以初始化路径url带上service
      projectList:[],
      addProjectDialogVisible:false,
      defaultActive:"Automation",
      addProjectForm:{
        name: "",
        description: ""
      },
      addProjectRule: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
        ],
      },

      editProjectDialogVisible:false,
      editProjectForm:{
        id:0,
        name: "",
        description: "",
        status:1
      },
      editProjectRule: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请输入项目状态', trigger: 'blur' },
        ]
      }

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
              this.$router.push('/login');}
            this.getAllProjects()
          }).catch(
          ()=>{this.$router.push('/login');}
          )
    },
    handleSelect(key){

      switch (key){ //处理右边顶部标题的展示
        case 'Automation':
          this.activeName="自动化";
          this.$router.push('/');
          break;
        case 'testTool':
          this.$router.push('/other');
          this.activeName="测试工具";
          break;
      }
    },
    getAllProjects(){
      getProjectList().then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.projectList = rsp.data.data;
        }
      }).catch()
    },
    deleteProject(data){
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        {
          deleteProject(data.id).then(rsp=>{
            let success = rsp.data.success
            if (true===success){
              this.getAllProjects();}
          }).catch(
              ()=>{}
          )
        }
      }).catch(() => {
      });
    },

    openAddProjectDialog(){ //点击创建按钮调用该函数
      this.addProjectDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.addProjectForm.name = "" //把两个字段置空
      this.addProjectForm.description = ""
    },
    addProjectConfirm(){  //点击创建项目弹窗中的确定按钮调用该函数
      this.$refs.addProjectFormm.validate((valid) => {  //定位到表单，然后去校验表单输入的是否合法有效是根据在data中定义的输入规则addProjectRule
        if (valid) {
          let req = {
            "name": this.addProjectForm.name,
            "description": this.addProjectForm.description,
          }
          createProject(req).then(rsp=>{  //把表单的数据当作createProject的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.addProjectDialogVisible = false
              this.getAllProjects()
            }
          }).catch(()=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    openeditProjectDialog(data){ //点击编辑按钮调用该函数
      this.editProjectDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.editProjectForm.id = data.id
      this.editProjectForm.name = data.name
      this.editProjectForm.description = data.description
      this.editProjectForm.status = data.status
    },
    editProjectConfirm(){  //点击编辑项目弹窗中的确定按钮调用该函数
      this.$refs.editProjectFormm.validate((valid) => {  //定位到表单，去校验表单输入的是否合法有效根据data中定义的输入规则addProjectRule
        if (valid) {
          let req = {
            "name": this.editProjectForm.name,
            "description": this.editProjectForm.description,
            "status": this.editProjectForm.status
          }
          updateProject(this.editProjectForm.id,req).then(rsp=>{  //把表单的数据当作createProject的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.editProjectDialogVisible = false
              this.getAllProjects()
            }
          }).catch(()=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }
  },
  created() {
    this.getUserInfo()
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
  padding-top: 10px;
  padding-left: 10px;
  font-weight:bolder;
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
  text-align: left;
  padding: 0 10px;
}
.home-main-left-image{
  width: 85px;
  margin: 20px auto;
  cursor: pointer;
}
.home-color{
  color: #cedce4;
}
</style>