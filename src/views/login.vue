<template>
  <div style="height: 100%">
    <div class="homeMain" :style="backgroundDiv">
      <div style="margin: 120px 0 0 120px">
        <div style="
        color: white;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.7;"
        >JOIN THE CHANGE</div>
        <div style="font-size: 3.5rem;font-weight: 400;
    line-height: 1.2; color: white;">
          <div>Space service</div>
          <div>that moves</div>
          <div>work forward</div>
        </div>
      </div>

      <div class="loginFrom">
        <div>
          <h2>itest platform</h2>
        </div>

        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="50px" class="demo-ruleForm">
          <el-form-item label="" prop="name">
            <el-input v-model="ruleForm.name" placeholder="Enter your username"></el-input>
          </el-form-item>
          <el-form-item label="" prop="pwd">
            <el-input show-password v-model="ruleForm.pwd" placeholder="Enter your password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 100%">登录</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <div class="homeFoot">
      <div class="homeFootText">2021 © XXX科技 - zhuxiaoqin.com</div>
    </div>

  </div>
</template>


<script>
// @ is an alias to /src
// import axios from "axios"
import {login} from "../request/user";
export default {
  name: 'Home',
  data() {
    return {
      backgroundDiv: {backgroundImage: 'url(' + require('../assets/image.jpeg') + ')'},

      ruleForm: {
        name: '',
        pwd: ''
      },

      rules: {
        name: [
          {required: true, message: 'Enter your username', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        pwd: [
          {required: true, message: 'Enter your password', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  components: {},
  methods: {
    submitForm() {
      // axios.get("http://127.0.0.1/backend/test/")
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          login(this.ruleForm.name,this.ruleForm.pwd).then(
              data=>{
                let success = data.data.success
                if(true===success){
                  this.$router.push('/')
                }else {
                  this.$message.error('登录失败：'+data.data.error.message);
                }
              }
          ).catch(()=>{
            this.$message.error('请求失败');
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }

}
</script>


<style>
.homeMain {
  width: 100%;
  height: 85%;
  background-size: 100% auto;
  display: flex;
  justify-content: space-between;
}
.homeFoot {
  height: 15%;
  background: #151b26;
  display: flex;
  align-items: center;
  justify-content: center;
}
.homeFootText {
  color: #8c98a4;
}
.loginFrom {
  width: 300px;
  background: white;
  border-radius: 5px;
  height: 270px;
  margin: 120px 120px 0 0;
  padding: 20px 30px;
}
</style>