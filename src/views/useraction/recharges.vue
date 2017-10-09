<template>
    <section>
        <el-table :data="recharges" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border style="width:100%;">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">

                        <el-form-item label="订单号:">
                            <span>{{ props.row.order_no }}</span>
                        </el-form-item>
                        <el-form-item label="金额:">
                            <span style="font-weight: bold;">{{ props.row.order_money }}</span>
                        </el-form-item>
                        <el-form-item label="支付方式:" >
                            <span>{{ props.row.order_type }}</span>
                        </el-form-item>
                        <el-form-item label="付款日期:">
                            <span>{{ props.row.order_date}}</span>
                        </el-form-item>
                        <el-form-item label="用户账户:">
                            <span>{{ props.row.account_no }}</span>
                        </el-form-item>
                        <el-form-item label="用户名:">
                            <span>{{ props.row.account_name }}</span>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="user_id" label="用户ID" width=""></el-table-column>
            <el-table-column prop="recharge_id" label="充值ID" width=""></el-table-column>
            <el-table-column prop="zonst_user_id" label="业务ID" width=""></el-table-column>
            <el-table-column prop="update_date" label="修改时间" width="170px"></el-table-column>
            <el-table-column prop="create_date" label="创建时间" width="170px"></el-table-column>
            <el-table-column prop="status" label="处理进度" width="100"
                             :filters="[{ text: '待处理', value: '待处理' }, { text: '已处理', value: '已处理' }]"
                             :filter-method="filterStatus" filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag :type="scope.row.status === '0' ? 'primary' : 'success'" close-transition>{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="" >
                <template scope="scope">
                    <el-button v-show="scope.row.status==='待处理'" type="primary" size="small" @click="rechargeAudit(scope.$index, scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next,jumper" style="float:right;"
                           @current-change="handleCurrentChange"
                           @size-change="pageSizeChange"
                           :page-size="page_size"
                           :total="total">
            </el-pagination>
        </el-col>
        <!--审核界面-->
        <el-dialog title="审核" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" class="editForm">
                <el-form-item label="充值ID" prop="recharge_id">
                    <el-input v-model="editForm.recharge_id" readonly unselectable="on" style="border:none;"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" prop="user_id">
                    <el-input v-model="editForm.user_id" readonly unselectable="on" style="border:none;"></el-input>
                </el-form-item>
                <el-form-item label="订单号" prop="order_no">
                    <el-input v-model="editForm.order_no"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="order_money">
                    <el-input v-model="editForm.order_money"></el-input>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-radio v-for="(key,value) in this.$store.state.comdata4" :key="value" :label="parseInt(value)" v-model="editForm.order_type" name="type">
                        {{key}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="支付日期" prop="order_date">
                    <el-input v-model="editForm.order_date" readonly unselectable="on" style="border:none;"></el-input>
                </el-form-item>
                <el-form-item label="用户账户" prop="account_no">
                    <el-input v-model="editForm.account_no"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="account_name">
                    <el-input v-model="editForm.account_name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交审核</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import api from '../../api/api'

    function getNowFormatDate(){
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let strHour=date.getHours();
        let strMinutes=date.getMinutes();
        let strSeconds=date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHour >= 0 && strHour <= 9) {
            strHour = "0" + strHour;
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
            strMinutes = "0" + strMinutes;
        }
        if (strSeconds >= 0 && strSeconds <= 9) {
            strSeconds = "0" + strSeconds;
        }
        return (date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHour + seperator2 + strMinutes
        + seperator2 + strSeconds);
    }
    export default{
        data(){
            return{
                sels:[],
                recharges:[],
                page_size:5,
                total:0,
                page:1,
                listLoading: false,
                editForm:{
                    recharge_id:'',
                    user_id:'',
                    order_no:'',
                    order_money:'',
                    order_type:'',
                    order_date:'',
                    account_no:'',
                    account_name:'',
                    description:''
                },
                editFormRules: {
                    order_no:[
                        { required: true, message: '请输入订单号', trigger: 'blur'}
                    ],
                    order_money: [
                        { required: true, message: '请输入金额', trigger: 'blur' }
                    ],
                    account_no:[
                        {required:true,message:'请输入用户账户',trigger: 'blur'}
                    ],
                    account_name:[
                        {required:true,message:'请输入用户名',trigger: 'blur'}
                    ],
                    description:[
                        { required: true, message: '请输入描述', trigger: 'blur'}
                    ]
                },
                editFormVisible:false
            }
        },
        methods:{
            filterStatus(value,row){
                return row.status === value;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            pageSizeChange(val) {
                this.page_size= val;
                this.getRechargeHistory();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRechargeHistory();
            },
            getRechargeHistory(){
                let para = {
                    page: this.page,
                    page_size:this.page_size,
                };
                this.listLoading = true;
                api.getRecharges(para)
                    .then(res=>{
                        if(res.data.status===0){
                            this.total=res.data.total;
                            let rechargesData=res.data.data;
                            let datas=[];
                            for(let i=0;i<rechargesData.length;i++){
                                let obj={};
                                obj.user_id=rechargesData[i].user_id;
                                obj.recharge_id=rechargesData[i].recharge_id;
                                obj.zonst_user_id=rechargesData[i].zonst_user_id;
                                obj.order_no=rechargesData[i].order_no;
                                obj.order_money=rechargesData[i].order_money;
                                obj.order_type=(rechargesData[i].order_type>2?'微信':(rechargesData[i].order_type===2?'支付宝':'银行'));
                                obj.order_date=rechargesData[i].order_date;
                                obj.account_no=rechargesData[i].account_no;
                                obj.account_name=rechargesData[i].account_name;
                                obj.description=rechargesData[i].description;
                                obj.update_date=rechargesData[i].update_date;
                                obj.create_date=rechargesData[i].create_date;
                                obj.status=(rechargesData[i].status===0?'待处理':'已处理');
                                datas[i]=obj;
                            }
                            this.recharges=datas;
                            setTimeout(()=>{
                                this.listLoading=false;
                            },1000);
                        }else{
                            setTimeout(()=>{
                                this.$message({
                                    message:'查询出错'+res.data.msg,
                                    type:'error'
                                });
                                this.listLoading=false;
                            },1000);
                        }
                    }).catch(err=>{
                    setTimeout(()=>{
                        this.$message({
                            message:'查询失败'+err,
                            type:'error'
                        });
                        this.listLoading=false;
                    },1000);
                    console.log(err);
                })
            },
            //显示充值审核界面
            rechargeAudit(index,row){
                if(row.status==='待处理'){
                this.editFormVisible = true;
                api.getOneRecharge(row.recharge_id).then(res=>{
                        if(res.data.status===0){
                            this.editForm={
                                recharge_id:res.data.data[0].recharge_id,
                                user_id:res.data.data[0].user_id,
                                order_no:(res.data.data[0].order_no===null?'':res.data.data[0].order_no),
                                order_money:res.data.data[0].order_money,
                                order_type:res.data.data[0].order_type,
                                order_date:(res.data.data[0].order_date===null?'未支付':res.data.data[0].order_date),
                                account_no:res.data.data[0].account_no,
                                account_name:res.data.data[0].account_name,
                                description:res.data.data[0].description
                            }
                        }
                    }).catch(err=>{
                    this.$message({
                        message:'获取信息失败'
                    });
                    console.log(err)
                })}else{
                    this.$message({
                        message:'已处理',
                        type:'warning'
                    })
                }
            },
            //提交审核
            editSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {})
                            .then(()=>{
                                this.editLoading = true;
                                let datas={
                                    recharge_id:parseInt(this.editForm.recharge_id),
                                    user_id:parseInt(this.editForm.user_id),
                                    order_no:this.editForm.order_no,
                                    order_money:Number(this.editForm.order_money),
                                    order_type:parseInt(this.editForm.order_type),
                                    order_date:getNowFormatDate(),
                                    account_no:this.editForm.account_no,
                                    account_name:this.editForm.account_name,
                                    description:this.editForm.description
                                };
                                api.auditRecharge(JSON.stringify(datas)).then(res=>{
                                    if(res.data.status===0){
                                        this.editLoading = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.editFormVisible = false;
                                        this.getRechargeHistory();}
                                }).catch(error=>{
                                    this.$message({
                                        message: '提交失败'+error,
                                        type: 'error'
                                    });
                                    this.editLoading = false;
                                    console.log(error)
                                })
                            })
                    }
                })
            }

        },
        mounted(){
            this.getRechargeHistory();
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-left: 12px;
        margin-bottom: 0;
        width: 40%;
    }
    .editForm{
        width: 350px;
        margin: 0 auto;
    }
    .dialog-footer{
        margin-right:180px;
    }
</style>