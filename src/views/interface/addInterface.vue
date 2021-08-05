<template>
  <div>
    <div>
      <div class="interface-params-dec">
        name
      </div>
      <el-input v-model="testCase.name" placeholder=""></el-input>
    </div>

    <div class="interface-params-in-line">
      <el-select v-model="testCase.method" placeholder="请选择">
        <el-option
            label="Get"
            :value="getMethod">
        </el-option>
        <el-option
            label="Post"
            :value="postMethod">
        </el-option>
      </el-select>
      <el-input v-model="testCase.url" placeholder="https://XXX.com "></el-input>
      <el-button type="primary" plain @click="debug">发送</el-button>
    </div>

    <div class="interface-params-in-line">
        <el-radio v-model="testCase.request_type" :label="formType">form-data</el-radio>
        <el-radio v-model="testCase.request_type" :label="jsonType">json</el-radio>
    </div>

    <div class="interface-params-in-line">
      <Editor v-model="testCase.request_body" @init="editorInit" lang="json" theme="chrome" width="450" height="200"></Editor>
    </div>

    <div>
      <div class="interface-params-dec">
        断言
      </div>
      <Editor v-model="testCase.response_assert" @init="editorInit" lang="json" theme="chrome" width="450" height="200"></Editor>
    </div>

    <div>
      <div class="interface-params-dec">
        响应
      </div>
      <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          v-model="testCase.response">
      </el-input>
    </div>

    <div class="interface-params-save">
      <el-button type="info" plain @click="cancel">取消</el-button>
      <el-button type="danger" plain @click="addInterface">保存</el-button>
    </div>

  </div>
</template>

<script>
import Editor from 'vue2-ace-editor'
import {createTestCase, debugTestCase} from "../../request/testCase";
export default {
  name: "addInterface",
  components: {
    Editor
  },
  props:{
    serviceId:{
      type:Number
    }
  },
  data(){
    return{
      getMethod: 1,
      postMethod: 2,
      formType: 1,
      jsonType: 2,
      testCase:{
        name:"",
        method: 1,
        url:"",
        request_type: 1,
        request_body:"{}",
        response_assert:"{}",
        response:"",
      }

    }
  },
  methods: {
    editorInit:function(){
      require('brace/ext/language_tools')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript')
    },
    addInterface(){
      // 首先校验下必填字段，其中url、request_type有默认值，不需要校验了
      if(undefined===this.serviceId || null===this.serviceId){
        this.$message.error('请选择模块');
        return
      }
      if(""===this.testCase.name){
        this.$message.error('请输入名称');
        return
      }
      if(""===this.testCase.url){
        this.$message.error('请输入URL');
        return
      }
      // 了解json的序列化和反序列化
      let req = JSON.parse(JSON.stringify(this.testCase)) //复制个新对象
      req.request_body = JSON.parse(req.request_body)
      req.response_assert = JSON.parse(req.response_assert)
      req.service_id = this.serviceId

      createTestCase(req).then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.$emit("addInterfaceSuccess")   //创建完以事件形式需通知父组件index.vue
        }
      }).catch()

    },
    cancel(){
      this.$emit("addInterfaceCancel")
    },
    debug(){
      if(""===this.testCase.url){
        this.$message.error('请输入URL');
        return
      }
      let newCase = JSON.parse(JSON.stringify(this.testCase)) //复制个新对象
      let req = {}
      req.url = newCase.url
      req.method = newCase.method
      req.request_type = newCase.request_type
      req.request_body = JSON.parse(newCase.request_body)

      debugTestCase(req).then(rsp=>{
        let success = rsp.data.success
        if (true===success){
          this.testCase.response = rsp.data.data
        }
      }).catch()
    }
  }
}
</script>

<style scoped>
.interface-params-dec{
  font-weight: bolder;
  margin-top: 15px;
  margin-bottom: 5px;
}
.interface-params-in-line{
  display: flex;
  margin-top: 10px;
}
.interface-params-save{
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}
</style>