<template>
    <div>
    <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm" :label-position="position" class="openform">
        <span class="octittle">账户信息:</span>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" @blur="emailTest"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
            <el-input v-model="addForm.qq"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="选择开票">
            <el-radio v-for="(key,value) in needs" :key="value" :label="parseInt(value)" v-model="addForm.need_invoice" name="type">
                {{key}}
            </el-radio>
        </el-form-item>
        <el-form-item label="开票类型">
            <el-radio v-for="(key,value) in statements" :key="value" :label="parseInt(value)" v-model="addForm.statement_type" name="type">
                {{key}}
            </el-radio>
        </el-form-item>

        <span class="octittle" style="position: relative;top: 10px">开票信息:</span>
        <el-form-item label="开票项目名称" prop="name" style="margin-top:20px;">
            <el-select v-model="addForm.name" placeholder="请选择开票项目名称" style="width: 290px;height: 36px;">
                <el-option
                        v-for="(key,value) in invoice_name"
                        :key="value"
                        :label="key"
                        :value="value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发票类型">
            <el-radio v-model="addForm.type" v-for="(key,value) in invoices" :key="value"
                      :label="parseInt(value)" id="radio">
                {{key}}
            </el-radio>
        </el-form-item>
        <el-form-item label="开票主体" prop="entity_name" style="margin-top:20px;">
        <el-select v-model="addForm.entity_name" placeholder="请选择开票主体" style="width: 290px;height: 36px;">
        <el-option
        v-for="(key,value) in entity_name"
        :key="value"
        :label="key"
        :value="value">
        </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="开票企业名称" prop="company_name">
            <el-input v-model="addForm.company_name"></el-input>
        </el-form-item>
        <el-form-item label="企业税号" prop="tax_no">
            <el-input v-model="addForm.tax_no"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="address">
            <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="注册电话" prop="telephone">
            <el-input v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank_name">
            <el-input v-model="addForm.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="银行帐号" prop="bank_no">
            <el-input v-model="addForm.bank_no"></el-input>
        </el-form-item>
        <el-button class="openbutton" native-type="reset">取消</el-button>
        <el-button class="openbutton" type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">开户</el-button>
    </el-form>
    </div>
</template>

<script>
    import api from '../../api/api';
    import axios from 'axios'
	export default {
		data() {
            let phoneValidate=(rule, value, callback)=>{
                if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(value))){
                    return callback(new Error('手机号码格式不正确'));
                }
                callback();
                };
            let telValidate=(rule,value,callback)=>{
                if(!((/^0\d{2,3}-[1-9]\d{6,7}$/.test(value))||(/^1[3|4|5|7|8][0-9]{9}$/.test(value)))){
                    return callback(new Error('电话号码格式不正确'));
                }
                callback();
            };
            let qqValidate=(rule,value,callback)=>{
                if(!(/[1-9][0-9]{4,}/.test(value))){
                    return callback(new Error('QQ号格式不正确'));
                }
                callback();
            };
            let bankNoValidate=(rule,value,callback)=>{
                if(!(/^\d{16}|\d{17}|\d{18}|\d{19}$/.test(value))){
                    return callback(new Error('银行卡号格式不正确'));
                }
                callback();
            };
            let checkType=(rule,value,callback)=>{
                if (!document.getElementById('radio').checked) {
                    return callback(new Error('请选择发票类型'));
                }
                callback();
            };
			return {
                addLoading: false,
                position:'left',
                statements:JSON.parse(sessionStorage.getItem('statement_type')),
                needs:JSON.parse(sessionStorage.getItem('need_invoice')),
                invoices:JSON.parse(sessionStorage.getItem('invoice_type')),
                invoice_name:JSON.parse(sessionStorage.getItem('invoice_name')),
                entity_name:JSON.parse(sessionStorage.getItem('entity_name')),
                addFormRules: {
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ],
                    password:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    qq:[
                        {required: true, message: 'QQ不可为空', trigger: 'blur'},
                        {validator:qqValidate,trigger:'blur'}
                    ],
                    phone:[
                        {required: true, message: '手机号码不可为空', trigger: 'blur'},
                        {validator:phoneValidate,trigger:'blur'}
                    ],
                    statement_type:[
                        {required: true, message: '请选择开票类型', trigger: 'change'}
                    ],
                    need_invoice:[
                        {required: true, message: '请选择是否开票', trigger: 'change'}
                    ],
                    name:[
                        { required: true, message: '请选择开票项目名称', trigger: 'change'}
                    ],
                    type: [
                        {validator:checkType,trigger:'change'}
                    ],
                    entity_name:[
                        { required: true, message: '请选择开票主体', trigger: 'change'}
                    ],
                    company_name:[
                        { required:true,message:'请填写发票抬头',trigger:'blur'}
                    ],
                    tax_no:[
                        { required:true,message:'企业税号',trigger:'blur'}
                    ],
                    address:[
                        { required:true,message:'请填写公司地址',trigger:'blur'},

                    ],
                    telephone:[
                        { required:true,message:'电话号码不可为空',trigger:'blur'},
                        { validator:telValidate,trigger:'blur'}
                    ],
                    bank_name:[
                        { required:true,message:'请填写开户行',trigger:'blur'},
                    ],
                    bank_no:[
                        { required:true,message:'请输入16-19位的银行卡号',trigger:'blur'},
                        { validator:bankNoValidate,trigger:'blur'}
                    ]
                },

                addForm:{
                    email:'',
                    password:'',
                    qq:'',
                    phone:'',
                    statement_type:0,
                    need_invoice: 0,

                    name:'',
                    type:1,
                    entity_name:'',
                    company_name:'',
                    tax_no:'',
                    address:'',
                    telephone:'',
                    bank_name:'',
                    bank_no:''
                }
			}
		},
		methods:{
            emailTest:function(){
                        axios.get('/signup/'+this.addForm.email).then(res => {
                            if(res.data.status!==0){
                                this.$message({
                                    message:res.data.msg,
                                    type:'error'
                                })
                            }else{
                                this.$message({
                                    message:'账号可用',
                                    type:'success'
                                })
                            }
                        }).catch(err => {
                            this.$message({
                                message:'请填写邮箱',
                                type:'error'
                            });
                            console.log(err)
                        });
                },
            addSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let datas={
                                    email:this.addForm.email,
                                    password:this.addForm.password,
                                    qq:this.addForm.qq,
                                    phone:this.addForm.phone,
                                    statement_type:parseInt(this.addForm.statement_type),
                                    need_invoice:parseInt(this.addForm.need_invoice),
                                invoice:{
                                    name:this.addForm.name,
                                    type:parseInt(this.addForm.type),
                                    entity_name:this.addForm.entity_name,
                                    company_name:this.addForm.company_name,
                                    tax_no:this.addForm.tax_no,
                                    address:this.addForm.address,
                                    telephone:this.addForm.telephone,
                                    bank_name:this.addForm.bank_name,
                                    bank_no:this.addForm.bank_no
                                }
                            };

                            api.addUser(JSON.stringify(datas))
                                .then((res) => {
                                if(res.data.status===0){
                                this.addLoading = false;
                                this.$message({
                                    message: '开户成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.$router.replace('/AccountInfo')
                                }else{
                                    setTimeout(()=>{
                                        this.$message({
                                            message:'开户出错'+res.data.msg,
                                            type:'error'
                                        });
                                        this.addLoading=false
                                    },1000)
                                }
                                })
                                .catch(error=>{
                                    setTimeout(()=>{
                                        this.$message({
                                            message:'开户失败'+error,
                                            type:'error',
                                        });
                                        this.addLoading=false;
                                        console.log(error);
                                    },1000)
                                })
                            });
                        }
                    });
                }
		    }
	    }
</script>
<style scoped>
.openform{
    margin: 20px auto 20px;
    width: 400px;
}
.openbutton{
    float: right;
    margin:0 25px 10px 0;
    position: relative;
    right: 100px;
    }
.octittle{
    position: relative;
    bottom: 10px;
    right: 60px;
    font-size: 16px;
    color:rgb(56,69,89);
}
</style>