<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">后台登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import api from '../api/api';
  import axios from 'axios';
  import $ from 'jquery'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2() {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            let loginParams = {
                email: this.ruleForm2.account,
                password: this.ruleForm2.checkPass
            };
//              let that=this;
//              $.ajax({
//                  type: "POST",
//                  url: "http://api.crm.echowap.com/login",
//                  data:JSON.stringify(loginParams),
////                  xhrFields: {
////                      withCredentials: true
////                  },
//                  success: function(res){
//                      that.logining = false;
//                      res=eval("(" + res + ")");
//                      if (res.status=== 0) {
//                          //username存入session,页面显示
//                          sessionStorage.setItem('user', JSON.stringify(loginParams));
//                          axios.get('/v1/options').then((res)=>{
//                              if(res.data.status===0){
//                                  that.$store.state.comdata1=res.data[0].invoice_type;
//                                  that.$store.state.comdata2=res.data[0].need_invoice;
//                                  that.$store.state.comdata3=res.data[0].statement_type;
//                              }
//                          });
//                          that.$router.push({ path: '/AccountInfo' });
//                      }else{
//                          that.$message({
//                              message:res.msg,
//                              type:'error'
//                          })
//                      }
//                  },
//                  error:function(error){
//                      console.log(error);
//                      that.$message({
//                          message: error,
//                          type: 'error'
//                      });
//                  }
//              });

            api.requestLogin(JSON.stringify(loginParams)).then(res => {
              this.logining = false;
              if (res.data.status=== 0) {
                  //username存入session,页面显示
                sessionStorage.setItem('user', JSON.stringify(loginParams));
                  axios.get('/v1/options').then((res)=>{
                      if(res.data.status===0){
                          sessionStorage.setItem('invoice_type',JSON.stringify(res.data.data[0].invoice_type));
                          sessionStorage.setItem('need_invoice',JSON.stringify(res.data.data[0].need_invoice));
                          sessionStorage.setItem('statement_type',JSON.stringify(res.data.data[0].statement_type));
                          sessionStorage.setItem('order_type',JSON.stringify(res.data.data[0].order_type));
                          sessionStorage.setItem('invoice_name',JSON.stringify(res.data.data[0].invoice_name));
                          sessionStorage.setItem('entity_name',JSON.stringify(res.data.data[0].entity_name));

//                          this.$store.state.comdata1=res.data.data[0].invoice_type;
//                          this.$store.state.comdata2=res.data.data[0].need_invoice;
//                          this.$store.state.comdata3=res.data.data[0].statement_type;
//                          this.$store.state.comdata4=res.data.data[0].order_type;
//                          this.$store.state.comdata5=res.data.data[0].user_user;
//                          this.$store.state.comdata6=res.data.data[0].action_module
                      }
                  });
                  this.$router.push({ path: '/AccountInfo' });
              }else{
                  this.$message({
                      message:res.data.msg,
                      type:'error'
                  })
              }
            }).catch(error =>{
                console.log(error);
                this.$message({
                    message: error,
                    type: 'error'
                });
            })
          }
        });
      }
    }
  }

</script>
<style>
    body{
        background-color: rgb(234,237,244);
    }
</style>
<style lang="scss" scoped>

  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;

    margin:  100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: #f1f2f6;
    border: 1px solid #f1f2f7;
    /*box-shadow: 0 0 25px #cac6c6;*/
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
