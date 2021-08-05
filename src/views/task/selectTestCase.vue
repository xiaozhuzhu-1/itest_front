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
    </div>

    <div>
      <el-table
          :data="testCaseList"
          :header-cell-style="{'color':'#555555'}"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="45">
        </el-table-column>
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
      </el-table>
      <div>
        <el-pagination
            :page-sizes="[20, 50, 100]"
            @size-change = "changeSize"
            @current-change = "changePage"
            layout="sizes,prev, pager, next"
            :total="testCaseCount">
        </el-pagination>
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="success">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>

  </div>
</template>

<script>

import {getServiceList} from "../../request/service";
import {getTestCaseList} from "../../request/testCase";
export default {
  name: "selectTestCase",
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
      testCaseCount:0,
      editTestCase:{},
      multipleSelection:[],
    }
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
    handleSelectionChange(val){
      this.multipleSelection = val; //用例列表复选框选择的内容数据在data中保存下
    },
    success(){
      this.$emit("success",this.multipleSelection)  //点击确定按钮成功后，把复选中的结果返回给父组件处理
    },
    cancel(){
      this.$emit("cancel")
    }
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