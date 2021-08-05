<template>
  <div>
      <div class="filterStyle">
        <div>
          <el-select v-model="currentServiceId" placeholder="请选择模块" @change="getAllTestCases">
            <el-option
                v-for="item in serviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" plain @click="openAddTestCaseDialog">创建用例</el-button>
      </div>

    <div v-if="!addTestCaseVisible && !editTestCaseVisible">
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
            <el-button @click="openEditTestCaseDialog(scope.row)" type="text" size="small">编辑</el-button> <!--scope.row相当于当前行的数据对象-->
            <el-button @click="deleteTestCase(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-start">
        <!--<span class="demonstration">共{{testCaseCount}}条</span>-->
        <el-pagination
            :page-sizes="[20, 50, 100]"
            @size-change = "changeSize"
            @current-change = "changePage"
            layout="sizes,prev, pager, next"
            :total="testCaseCount">
        </el-pagination>
      </div>
    </div>

    <addInterface v-if="addTestCaseVisible"
                  @addInterfaceSuccess="addInterfaceSuccess"
                  @addInterfaceCancel="addInterfaceCancel"
                  :service-id="currentServiceId"></addInterface>

    <editInterface v-if="editTestCaseVisible"
                  @editInterfaceSuccess="editInterfaceSuccess"
                  @editInterfaceCancel="editInterfaceCancel"
                   :need-edit-data="editTestCase"
                  :service-id="currentServiceId"></editInterface>
  </div>
</template>

<script>
import {getServiceList} from "../../request/service";
import {deleteTestCase, getTestCaseList} from "../../request/testCase";
import AddInterface from "./addInterface";
import EditInterface from "./editInterface";
export default {
  name: "index",
  props: {
    projectId: {
      type: String
    }
  },
  data() {
    return {
      currentServiceId:undefined,
      serviceList:[],
      testCaseList:[],
      page:1,
      size:20,
      addTestCaseVisible:false,
      editTestCaseVisible:false,
      testCaseCount:0,
      editTestCase:{}
    }
  },
  components: {
    AddInterface,
    EditInterface
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
    getAllTestCases(){
      getTestCaseList(this.currentServiceId,this.size,this.page).then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.testCaseList = rsp.data.data.list;
          this.testCaseCount = rsp.data.data.total;
        }
      }).catch()
    },
    changeSize(size){
      this.size = size;
      this.getAllTestCases()
    },
    changePage(page){
      this.page = page;
      this.getAllTestCases()
    },
    deleteTestCase(data){
      this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        {
          deleteTestCase(data.id).then(rsp=>{
            let success = rsp.data.success
            if (true===success){
              this.getAllTestCases();}
          }).catch(
              ()=>{}
          )
        }
      }).catch(() => {
      });
    },
    addInterfaceSuccess(){
      this.addTestCaseVisible = false
      this.getAllTestCases()
    },
    addInterfaceCancel(){
      this.addTestCaseVisible = false
    },
    editInterfaceSuccess(){
      console.log(22222222)
      this.editTestCaseVisible = false
      this.getAllTestCases()
    },
    editInterfaceCancel(){
      this.editTestCaseVisible = false
    },

    openAddTestCaseDialog(){ //点击创建按钮调用该函数
      this.addTestCaseVisible = true //该参数判断是否显示出添加用例 组件
    },

    openEditTestCaseDialog(data){ //点击编辑按钮调用该函数
      this.editTestCase = data
      this.editTestCaseVisible = true //点击按钮后把dialog对话框显示出来
    },
  },
  created() {
    this.getAllServices()
  }
}
</script>

<style scoped>
.filterStyle{
  display: flex;
  justify-content: flex-start;
}
</style>