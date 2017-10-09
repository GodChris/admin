<template>
    <section>
        <el-table :data="audit" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border style="width:100%;">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="公司地址:">
                            <span>{{ props.row.company_addr}}</span>
                        </el-form-item>
                        <el-form-item label="税号:">
                            <span>{{ props.row.tax_no }}</span>
                        </el-form-item>
                        <el-form-item label="发票类型:">
                            <span>{{ props.row.statement_type }}</span>
                        </el-form-item>
                        <el-form-item label="开票:">
                            <span>{{ props.row.need_invoice }}</span>
                        </el-form-item>
                        <el-form-item label="业务ID:">
                            <span>{{ props.row.zonst_user_id }}</span>
                        </el-form-item>
                        <el-form-item label="开票主体:">
                            <span>{{ props.row.entity_name}}</span>
                        </el-form-item>
                        <el-form-item label="开票类型:">
                            <span>{{ props.row.invoice_type }}</span>
                        </el-form-item>
                        <el-form-item label="电话号码:">
                            <span>{{ props.row.invoice_tel }}</span>
                        </el-form-item>
                        <el-form-item label="开户银行:">
                            <span>{{ props.row.invoice_bank }}</span>
                        </el-form-item>
                        <el-form-item label="银行帐号:">
                            <span>{{ props.row.invoice_bank_no }}</span>
                        </el-form-item>
                        <el-form-item label="开票姓名:">
                            <span>{{ props.row.invoice_name}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="user_id" label="用户ID" width=""></el-table-column>
            <el-table-column prop="email" label="邮箱" width=""></el-table-column>
            <el-table-column prop="company_name" label="公司名" width=""></el-table-column>
            <el-table-column prop="qq" label="QQ" width=""></el-table-column>
            <el-table-column prop="phone" label="手机号码" width=""></el-table-column>
            <el-table-column prop="reg_date" label="注册时间" width=""></el-table-column>
            <el-table-column label="操作"  width="">
                <template scope="scope">
                    <el-button size="small" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
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
    </section>
</template>

<script>
    import api from '../../api/api'
    export default{
        data(){
            return{
            sels:[],
            total:0,
            page:1,
            page_size:5,
            listLoading: false,
            audit:[]
            }
        },
        methods:{
            selsChange: function (sels) {
                this.sels = sels;
            },
            pageSizeChange(val) {
                this.page_size= val;
                this.getAuditUsers();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getAuditUsers();
            },
            getAuditUsers(){
                let para = {
                    page: this.page,
                    page_size:this.page_size,
                };
                this.listLoading = true;
                api.getAuditUser(para)
                    .then(res =>{
                        if(res.data.status===0){
                            this.total=res.data.total;
                            let auditData=res.data.data;
                            let datas=[];
                            for(let i=0;i<auditData.length;i++){
                                let obj={};
                                obj.user_id=auditData[i].user_id;
                                obj.email=auditData[i].email;
                                obj.reg_date=auditData[i].reg_date;
                                obj.company_name=auditData[i].company_name;
                                obj.company_addr=auditData[i].company_addr;
                                obj.tax_no=auditData[i].tax_no;
                                obj.statement_type=auditData[i].statement_type;
                                obj.need_invoice=auditData[i].need_invoice;
                                obj.zonst_user_id=auditData[i].zonst_user_id;

                                obj.entity_name=(auditData[i].invoice===null?'未填':auditData[i].invoice.entity_name);
                                //暂时的解决方案
                                obj.invoice_type=(auditData[i].invoice===null?'未填':(auditData[i].invoice.invoice_type===1)?'普票':'专票');
                                obj.invoice_tel=(auditData[i].invoice===null?'未填':auditData[i].invoice.invoice_tel);
                                obj.invoice_bank=(auditData[i].invoice===null?'未填':auditData[i].invoice.invoice_bank);
                                obj.invoice_bank_no=(auditData[i].invoice===null?'未填':auditData[i].invoice.invoice_bank_no);
                                obj.invoice_name=(auditData[i].invoice===null?'未填':auditData[i].invoice.invoice_name);

                                obj.phone=auditData[i].phone;
                                obj.qq=auditData[i].qq;
                                datas[i]=obj;
                            }
                            this.audit=datas;
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
                    }).catch(err =>{
                    setTimeout(()=>{
                        this.$message({
                            message:'未查询到数据'+err,
                            type:'error'
                        });
                        this.listLoading=false
                    },1000);
                    console.log(err)
                });
            },
            handleAudit: function(index){
                this.$confirm('确认通过该账号审核?', '提示', {
                    type: 'warning'
                }).then(()=>{
                    this.listLoading = true;
                    let id={user_id:this.audit[index].user_id};
                    console.log(id);
                    api.auditUser(JSON.stringify(id))
                        .then(res =>{
                            if(res.data.status===0){
                            this.listLoading = false;
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getAuditUsers();}
                            else{
                                this.listLoading = false;
                                this.$message({
                                    message: '操作失败'+res.data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch(err=>{
                        this.listLoading = false;
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                        console.log(err);
                    })
                })
            }
        },
        mounted(){
            this.getAuditUsers();
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
    .demo-table-expand .el-form-item  {
        margin-right: 0;
        margin-left: 12px;
        margin-bottom: 0;
        width: 40%;
    }
    .toolbar{

    }
</style>