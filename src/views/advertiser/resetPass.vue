<template>
    <el-form :model="modify" :labelPosition="labelPosition" :rules="modifyRules" class="modifyForm" ref="modify">
        <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="modify.email"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
            <el-input v-model="modify.newPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
            <el-input v-model="modify.confirmPass" type="password"></el-input>
        </el-form-item>

        <el-button class="modifyButton" native-type="reset">重填</el-button>
        <el-button class="modifyButton" type="primary" @click.native="modifyPass('modify')" :loading="modifyLoading">修改密码</el-button>
    </el-form>
</template>

<script>
    import api from '../../api/api'
    export default{
        data(){
            let passValidate=(rule,value,callback)=>{
                if(value!==this.modify.newPass){
                    callback(new Error('两次输入密码不一致!'));
                }
                callback();

            };
            return{
                modifyRules:{
                    email:[
                        {required: true, message: '请输入用户ID', trigger: 'blur'}
                    ],
                    newPass:[
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    confirmPass:[
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator:passValidate,trigger:'blur'}
                    ]
                },
                labelPosition:'top',
                modify:{
                    email:'',
                    newPass:'',
                    confirmPass:''
                },
                modifyLoading:false,
            }
        },
        methods:{
            modifyPass:function(formName){
                this.$refs[formName].validate((valid) =>{
                    if(valid){
                        this.$confirm('确认重置该用户密码吗？', '提示', {}).then(()=>{
                            this.modifyLoading=true;
                            let resetData={
                                email:this.modify.email,
                                password:this.modify.newPass,
                                dpassword:this.modify.confirmPass
                            };
//                            console.log(JSON.stringify(resetData));
                    api.resetPass(JSON.stringify(resetData))
                        .then(res=>{
                            if(res.data.status===0){
                                this.modifyLoading = false;
                                this.$message({
                                    message: '重置成功',
                                    type: 'success'
                                });
                                this.$refs['modify'].resetFields();
                                this.$router.replace('/AccountInfo')
                            }else{
                                setTimeout(()=>{
                                    this.$message({
                                        message:'重置出错'+res.data.msg,
                                        type:'error',
                                    });
                                    this.modifyLoading=false
                                },1000)
                            }
                        }).catch(err=>{
                        this.$message({
                            message:'重置失败'+err,
                            type:'error',
                        });
                        console.log(err);
                        this.modifyLoading=false
                    })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .modifyForm{
        margin: 20px auto 20px;
        width: 300px;
        height:464px;
    }
    .modifyButton{
        float: right;
        margin:0 25px 10px 0;
        position: relative;
        right: 100px;
    }
</style>
