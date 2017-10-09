<template>
    <el-form :model="rechargesForm" label-width="80px" :rules="rechargesFormRules" ref="rechargesForm" :label-position="position" class="rechargesForm">
        <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="rechargesForm.email"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="order_no">
            <el-input v-model="rechargesForm.order_no"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="order_money">
            <el-input v-model="rechargesForm.order_money"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
            <el-radio v-for="(key,value) in order_types" :key="value"
                      :label="parseInt(value)" v-model="rechargesForm.order_type" name="type">
                {{ key }}
            </el-radio>
        </el-form-item>
        <el-form-item label="用户账号" prop="account_no">
            <el-input v-model="rechargesForm.account_no"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="account_name">
            <el-input v-model="rechargesForm.account_name"></el-input>
        </el-form-item>
        <el-form-item label="付款时间" prop="order_date">
            <el-date-picker
                    v-model="rechargesForm.order_date"
                    type="datetime" style="width: 320px;"
                    placeholder="选择付款时间" @change="select" >
            </el-date-picker>
            <!--<el-input v-model="rechargesForm.order_date"></el-input>-->
        </el-form-item>
        <el-form-item label="注释" prop="description">
            <el-input v-model="rechargesForm.description"></el-input>
        </el-form-item>
        <el-button class="openbutton" native-type="reset">取消</el-button>
        <el-button class="openbutton" type="primary" @click.native="addSubmit('rechargesForm')" :loading="addLoading">充值</el-button>
    </el-form>
</template>

<script>
    import api from '../../api/api'
    //format date,String
//    function getNowFormatDate(){
//        let date = new Date();
//        let seperator1 = "-";
//        let seperator2 = ":";
//        let month = date.getMonth() + 1;
//        let strDate = date.getDate();
//        let strHour=date.getHours();
//        let strMinutes=date.getMinutes();
//        let strSeconds=date.getSeconds();
//        if (month >= 1 && month <= 9) {
//            month = "0" + month;
//        }
//        if (strDate >= 0 && strDate <= 9) {
//            strDate = "0" + strDate;
//        }
//        if (strHour >= 0 && strHour <= 9) {
//            strHour = "0" + strHour;
//        }
//        if (strMinutes >= 0 && strMinutes <= 9) {
//            strMinutes = "0" + strMinutes;
//        }
//        if (strSeconds >= 0 && strSeconds <= 9) {
//            strSeconds = "0" + strSeconds;
//        }
//        return (date.getFullYear() + seperator1 + month + seperator1 + strDate
//            + " " + strHour + seperator2 + strMinutes
//            + seperator2 + strSeconds);
//    }
    export default{
        data(){
            return{
                position:'left',
                addLoading:false,
                order_types:JSON.parse(sessionStorage.getItem('order_type')),
                rechargesForm:{
                    email:'',
                    order_no:'',
                    order_money:'',
                    order_type:1,
                    order_date:'',
                    account_no:'',
                    account_name:'',
                    description:''
                },
                rechargesFormRules:{
                    email:[
                        {required: true, message: '请输入用户邮箱', trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                    ],
                    order_no:[
                        {required: true, message: '请输入订单号', trigger: 'blur'}
                    ],
                    order_money:[
                        {required: true, message: '请输入充值金额', trigger: 'blur'}
                    ],
                    account_no:[
                        {required: true, message: '请输入用户账号', trigger: 'blur'}
                    ],
                    account_name:[
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    description:[
                        {required: true, message: '请填写注释', trigger: 'blur'}
                    ],
                    order_type:[
                        {required:true,message:'请选择支付方式',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            select(value){
                this.rechargesForm.order_date=value;
                console.log(value)
            },
            addSubmit: function (formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.$confirm('确认为该用户充值 '+this.rechargesForm.order_money+' 元吗？', '提示', {}).then(()=>{
                            this.addLoading=true;
                            let datas={
                                email:this.rechargesForm.email,
                                order_no:this.rechargesForm.order_no,
                                order_money:Number(this.rechargesForm.order_money),
                                order_type:parseInt(this.rechargesForm.order_type),
                                order_date:this.rechargesForm.order_date,
                                account_no:this.rechargesForm.account_no,
                                account_name:this.rechargesForm.account_name,
                                description:this.rechargesForm.description
                            };
                            console.log(JSON.stringify(datas));
                            api.addRecharges(JSON.stringify(datas)).then(res=>{
                                if(res.data.status===0){
                                    this.addLoading=false;
                                    this.$message({
                                        message: '充值成功',
                                        type: 'success'
                                    });
                                    this.$refs['rechargesForm'].resetFields();
                                    this.$router.replace('/recharges')
                                }else{
                                    setTimeout(()=>{
                                        this.$message({
                                            message:'充值出错'+res.data.msg,
                                            type:'error'
                                        });
                                        this.addLoading=false
                                    },1000)
                                }
                            }).catch(err=>{
                                setTimeout(()=>{
                                    this.$message({
                                        message:'充值失败'+err,
                                        type:'error'
                                    });
                                    this.addLoading=false;
                                },1000);
                                console.log(err);
                            })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .rechargesForm{
        margin: 20px auto 20px;
        width: 400px;
    }
    .openbutton{
        float: right;
        margin:0 25px 10px 0;
        position: relative;
        right: 100px;
    }
</style>