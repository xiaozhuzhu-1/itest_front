<template>
  <div>
    <div class="home-main-right-context">
      <el-button type="primary" plain @click="openAddServiceDialog">创建模块</el-button>
      <el-table
          :data="serviceList"
          :header-cell-style="{'color':'#555555'}"
          stripe
          style="width: 100%">
        <el-table-column
            prop="name"
            label="名称"
            min-width="30%">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述"
            min-width="50%">
        </el-table-column>
        <el-table-column
            prop="ops"
            label="操作"
            min-width="20%">
          <template slot-scope="scope">
            <el-button @click="openeditServiceDialog(scope.row)" type="text" size="small">编辑</el-button> <!--scope.row相当于当前行的数据对象-->
            <el-button @click="deleteService(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建模块" :visible.sync="addServiceDialogVisible">
      <el-form :model="addServiceForm" :rules="addServiceRule" ref="addServiceFormm">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="addServiceForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop ="description">
          <el-input type="textarea" :rows="2" v-model="addServiceForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addServiceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addServiceConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑模块" :visible.sync="editServiceDialogVisible">
      <el-form :model="editServiceForm" :rules="editServiceRule" ref="editServiceFormm">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="editServiceForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop ="description">
          <el-input type="textarea" :rows="2" v-model="editServiceForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editServiceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editServiceConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {createService, deleteService, getServiceList, updateService} from "../../request/service";

export default {
  name: "index",
  props: {
    projectId: {
      type: String
    }
  },
  data() {
    return {
      serviceList:[],
      addServiceDialogVisible:false,
      addServiceForm:{
        name: "",
        description: ""
      },
      addServiceRule: {
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入模块描述', trigger: 'blur' },
        ],
      },

      editServiceDialogVisible:false,
      editServiceForm:{
        id:0,
        name: "",
        description: "",
      },
      editServiceRule: {
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入模块描述', trigger: 'blur' },
        ],
      }

    }
  },
  components: {
  },
  methods:{
    getAllServices(){
      getServiceList(this.projectId).then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.serviceList = rsp.data.data;
        }
      }).catch()
    },
    deleteService(data){
      this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        {
          deleteService(data.id).then(rsp=>{
            let success = rsp.data.success
            if (true===success){
              this.getAllServices();}
          }).catch(
              ()=>{}
          )
        }
      }).catch(() => {
      });
    },

    openAddServiceDialog(){ //点击创建按钮调用该函数
      this.addServiceDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.addServiceForm.name = "" //把两个字段置空
      this.addServiceForm.description = ""
    },
    addServiceConfirm(){  //点击创建项目弹窗中的确定按钮调用该函数
      this.$refs.addServiceFormm.validate((valid) => {  //定位到表单，然后去校验表单输入的是否合法有效是根据在data中定义的输入规则addServiceRule
        if (valid) {
          let req = {
            "name": this.addServiceForm.name,
            "description": this.addServiceForm.description,
            "project_id":Number(this.projectId),
          }
          createService(req).then(rsp=>{  //把表单的数据当作createService的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.addServiceDialogVisible = false
              this.getAllServices()
            }
          }).catch(()=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    openeditServiceDialog(data){ //点击编辑按钮调用该函数
      this.editServiceDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.editServiceForm.id = data.id
      this.editServiceForm.name = data.name
      this.editServiceForm.description = data.description
    },
    editServiceConfirm(){  //点击编辑项目弹窗中的确定按钮调用该函数
      this.$refs.editServiceFormm.validate((valid) => {  //定位到表单，去校验表单输入的是否合法有效根据data中定义的输入规则addServiceRule
        if (valid) {
          let req = {
            "name": this.editServiceForm.name,
            "description": this.editServiceForm.description,
            "project_id":Number(this.projectId)
          }
          updateService(this.editServiceForm.id,req).then(rsp=>{  //把表单的数据当作createService的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.editServiceDialogVisible = false
              this.getAllServices()
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
    this.getAllServices()
  }
}
</script>

<style scoped>

</style>