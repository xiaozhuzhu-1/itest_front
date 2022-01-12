<template>
  <div>
    <div class="home-main-right-context">
      <el-button type="primary" plain @click="openAddTaskDialog">创建任务</el-button>
      <el-table
          :data="taskList"
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
            min-width="40%">
        </el-table-column>
        <el-table-column
            prop="ops"
            label="操作"
            min-width="30%">
          <template slot-scope="scope">
            <el-button @click="openeditTaskDialog(scope.row)" type="text" size="small">编辑</el-button> <!--scope.row相当于当前行的数据对象-->
            <el-button @click="deleteTask(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="openTaskTestCaseDialog(scope.row)" type="text" size="small">用例管理</el-button>
            <el-button @click="openTaskTestRunDialog(scope.row)" type="text" size="small">执行管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="创建任务" :visible.sync="addTaskDialogVisible">
      <el-form :model="addTaskForm" :rules="addTaskRule" ref="addTaskFormm">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="addTaskForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop ="description">
          <el-input type="textarea" :rows="2" v-model="addTaskForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTaskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTaskConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑任务" :visible.sync="editTaskDialogVisible">
      <el-form :model="editTaskForm" :rules="editTaskRule" ref="editTaskFormm">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="editTaskForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop ="description">
          <el-input type="textarea" :rows="2" v-model="editTaskForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editTaskConfirm">确 定</el-button>
        <el-button @click="editTaskDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用例列表" :visible.sync="taskTestCaseDialogVisible" width="80%" style="margin-top: -50px">
      <div style="height: 500px; overflow-y: auto"> <!--当数据超过500px时，对话框的高自动滚动-->
        <el-button type="primary" plain @click="selectTaskTestCaseDialogVisible = true">添加用例</el-button>
        <el-table
            :data="testCaseList"
            :header-cell-style="{'color':'#555555'}"
            stripe
            style="width: 100%">
          <el-table-column
              prop="name"
              label="名称"
              min-width="20%">
          </el-table-column>
          <el-table-column
              prop="url"
              label="URL"
              min-width="35%">
          </el-table-column>
          <el-table-column
              prop="method"
              label="方法"
              min-width="10%">
            <template slot-scope="scope">
              <span>{{1===scope.row.method ? "Get":"Post"}}</span>
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
              min-width="15%">
            <template slot-scope="scope">
              <el-button @click="removeTestCase(scope.row)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="选择用例" :visible.sync="selectTaskTestCaseDialogVisible" width="70%" style="margin-top: -50px">
      <div style="height: 500px; overflow-y: auto">
        <selectTestCase :project-id="projectId"
                        @success="addTaskTestCaseFun"
                        @cancel="selectTaskTestCaseDialogVisible = false"></selectTestCase>
      </div>
    </el-dialog>

    <el-dialog title="执行管理" :visible.sync="taskRunDialogVisible" width="70%" style="margin-top: -50px">
      <div style="height: 500px; overflow-y: auto">
        <el-button type="primary" plain @click="runTaskFun">单次执行</el-button>

        <el-button type="primary" plain @click="taskIntervalRunDialogVisible=true">循环执行</el-button>
        <el-button type="info" plain @click="stopIntervalRunTask">停止循环执行</el-button>
        <div v-if="taskIntervalRunDialogVisible" style="margin: 5px 0 5px 0">
          <el-date-picker
              style="margin: 5px 0"
              size="mini"
              v-model="currentTask.start_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间">
          </el-date-picker>
          <br/>
          <span>天</span>
          <el-input-number size="mini"
                           :min="0"
                           v-model="currentTask.days"
                           style="margin-right: 15px"></el-input-number>
          <span>时</span>
          <el-input-number size="mini"
                           :min="0"
                           v-model="currentTask.hours"
                           style="margin-right: 15px"></el-input-number>
          <span>分</span>
          <el-input-number size="mini"
                           :min="0"
                           v-model="currentTask.minutes"></el-input-number>
          <br/>
          <br/>
          <el-button size="small" type="danger" plain @click="openIntervalRun">保存</el-button>
          <el-button size="small" type="info" plain @click="taskIntervalRunDialogVisible=false">取消</el-button>
        </div>


        <el-table
            :data="taskReportList"
            :header-cell-style="{'color': '#555555'}"
            stripe
            style="width: 100%">
          <el-table-column
              prop="name"
              label="名称"
              min-width="100%">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="openReportDetail(scope.row)">{{scope.row.name}}</a>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Loading } from 'element-ui';
import {
  addTaskTestCase,
  createTask,
  deleteTask,
  deleteTaskTestCase,
  getTaskList, getTaskReports,
  getTaskTestCase, runIntervalTask, runTask, stopIntervalTask,
  updateTask
} from "../../request/task";
import selectTestCase from "./selectTestCase";

export default {
  name: "index",
  props: {
    projectId: {
      type: String
    }
  },
  data() {
    return {
      taskList:[],
      addTaskDialogVisible:false,
      taskTestCaseDialogVisible:false,
      testCaseList:[],
      currentTask:undefined,
      selectTaskTestCaseDialogVisible:false,
      addTaskForm:{
        name: "",
        description: ""
      },
      addTaskRule: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' },
        ],
      },

      editTaskDialogVisible:false,
      editTaskForm:{
        id:0,
        name: "",
        description: "",
      },
      editTaskRule: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' },
        ],
      },
      taskRunDialogVisible:false,
      taskReportList:[],
      taskIntervalRunDialogVisible:false
    }
  },
  components: {
    selectTestCase
  },
  methods:{
    getAllTasks(){
      getTaskList(this.projectId).then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.taskList = rsp.data.data;
        }
      }).catch()
    },
    deleteTask(data){
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        {
          deleteTask(data.id).then(rsp=>{
            let success = rsp.data.success
            if (true===success){
              this.getAllTasks();}
          }).catch(
              ()=>{}
          )
        }
      }).catch(() => {
      });
    },

    openAddTaskDialog(){ //点击创建按钮调用该函数
      this.addTaskDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.addTaskForm.name = "" //把两个字段置空
      this.addTaskForm.description = ""
    },
    addTaskConfirm(){  //点击创建项目弹窗中的确定按钮调用该函数
      this.$refs.addTaskFormm.validate((valid) => {  //定位到表单，然后去校验表单输入的是否合法有效是根据在data中定义的输入规则addTaskRule
        if (valid) {
          let req = {
            "name": this.addTaskForm.name,
            "description": this.addTaskForm.description,
            "project_id":Number(this.projectId),
          }
          createTask(req).then(rsp=>{  //把表单的数据当作createTask的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.addTaskDialogVisible = false
              this.getAllTasks()
            }
          }).catch(()=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    openeditTaskDialog(data){ //点击编辑按钮调用该函数
      this.editTaskDialogVisible = true //点击按钮后把dialog对话框显示出来
      this.editTaskForm.id = data.id
      this.editTaskForm.name = data.name
      this.editTaskForm.description = data.description
    },
    editTaskConfirm(){  //点击编辑项目弹窗中的确定按钮调用该函数
      this.$refs.editTaskFormm.validate((valid) => {  //定位到表单，去校验表单输入的是否合法有效根据data中定义的输入规则addTaskRule
        if (valid) {
          let req = {
            "name": this.editTaskForm.name,
            "description": this.editTaskForm.description,
            "project_id":Number(this.projectId)
          }
          updateTask(this.editTaskForm.id,req).then(rsp=>{  //把表单的数据当作createTask的入参，然后后端处理创建并返回数据
            let success = rsp.data.success; //从接口返回数据获取成功信息
            if(true===success){ //若接口返回成功，则关闭对话框重新请求下列表全部
              this.editTaskDialogVisible = false
              this.getAllTasks()
            }
          }).catch(()=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    openTaskTestCaseDialog(task){
      this.currentTask = task
      this.taskTestCaseDialogVisible = true
      this.getTaskTestCaseListFun(task.id)
    },
    getTaskTestCaseListFun(taskId){
      getTaskTestCase(taskId).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.testCaseList = rsp.data.data
        }
      }).catch(()=>{
      })

    },
    removeTestCase(data){
      console.log(data)
      deleteTaskTestCase(this.currentTask.id,data.task_test_case_id).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.getTaskTestCaseListFun(this.currentTask.id)
        }
      }).catch(()=>{
      })
    },
    addTaskTestCaseFun(data){
      let testCaseIds = []
      for(let i=0;i<data.length;i++){
        testCaseIds.push(data[i].id)
      }
      if(testCaseIds.length===0){return}
      addTaskTestCase(this.currentTask.id,{"test_case_ids":testCaseIds}).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.getTaskTestCaseListFun(this.currentTask.id)
          this.selectTaskTestCaseDialogVisible = false
        }
      }).catch(()=>{
      })
    },
    openTaskTestRunDialog(task){
      this.currentTask = task;
      this.taskRunDialogVisible = true;
      this.getTaskReportList(task.id)
    },

    runTaskFun(){
      let loadingInstance1 = Loading.service({ fullscreen: true });
      runTask(this.currentTask.id).then(rsp=>{
        console.log(this.currentTask.id)
        let success = rsp.data.success;
        if(true===success){
          this.getTaskReportList(this.currentTask.id)
        }
        loadingInstance1.close();
      }).catch(()=>{
      })
    },
    getTaskReportList(taskId){
      getTaskReports(taskId).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.taskReportList = rsp.data.data
        }
      }).catch(()=>{
      })
    },
    openReportDetail(report){
      window.open(`http://121.41.98.227/backend/task/${this.currentTask.id}/report/${report.name}/`)
    },
    openIntervalRun(){
      if(""===this.currentTask.start_time || null===this.currentTask.start_time){
        this.$message.error('请输入开始时间');
        return }
      let req = {
        days:this.currentTask.days,
        hours: this.currentTask.hours,
        minutes: this.currentTask.minutes,
        start_time: this.currentTask.start_time}
      runIntervalTask(this.currentTask.id, req).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.$message('开启循环执行成功');
          console.log("开启循环执行")
          this.currentTask.days = req.days;
          this.currentTask.hours = req.hours;
          this.currentTask.minutes = req.minutes;
          this.currentTask.start_time = req.start_time;
          this.currentTask.interval_switch = true;
        }
      }).catch(()=>{})
    },
    stopIntervalRunTask(){
      stopIntervalTask(this.currentTask.id).then(rsp=>{
        let success = rsp.data.success;
        if(true===success){
          this.$message('停止循环执行成功');
          console.log("停止循环执行")
          this.currentTask.days = 0;
          this.currentTask.hours = 0;
          this.currentTask.minutes = 0;
          this.currentTask.start_time = null;
          this.currentTask.interval_switch = false;
        }
      }).catch(()=>{})

    }

  },
  created() {
    this.getAllTasks()
  }
}
</script>

<style scoped>

</style>