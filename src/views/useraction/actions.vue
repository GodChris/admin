<template>
    <section>
        <!--筛选条件-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
            <!--<el-form :inline="true" :model="filters">-->
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.email" placeholder="邮箱"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="getActionlogByEmail">查询</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</el-col>-->

        <el-table class="tables" :data="actions" highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange" border height="440" max-height="440">
            <el-table-column prop="user_email" label="用户邮箱" width="175px"></el-table-column>
            <el-table-column prop="user_action_email" label="操作用户" width="175px"></el-table-column>
            <el-table-column prop="action_module" :formatter="formatModule" label="操作模块" width="100px"></el-table-column>
            <el-table-column prop="action_id" label="操作模块ID" width="110px"></el-table-column>
            <el-table-column prop="action_type" label="操作类型" width="100px"></el-table-column>
            <el-table-column prop="create_date" label="创建时间" width="170px"></el-table-column>
            <el-table-column prop="ip_address" label="IP地址" width="133px"></el-table-column>
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
                actions:[],
                page_size:20,
                total:0,
                page:1,
                listLoading: false,
//                filters:{
//                    email:''
//                }
            }
        },
        methods:{
            formatModule(row){
                return row.action_module===null?'null':(row.action_module==="account"?'账户':(row.action_module==="campaign"?'活动':(row.action_module==="recharge"?'充值':(row.action_module==="segment"?'人群包':'定向'))));
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            pageSizeChange(val) {
                this.page_size= val;
                this.getActionLog();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getActionLog();
            },
            getActionLog(){
                let para={
                    page:this.page,
                    page_size:this.page_size
                };

//                console.log(this.$store.state.comdata6.account);
                this.listLoading = true;
                api.getActions(para)
                    .then(res=>{
                        if(res.data.status===0){
                            this.total=res.data.total;
                            let actionsData=res.data.data;
                            let datas=[];
                            for(let i=0;i<actionsData.length;i++){
                                let obj={};
                                obj.user_email=actionsData[i].user_email;
                                obj.user_action_email=actionsData[i].user_action_email;
                                obj.action_module=actionsData[i].action_module;
                                obj.action_id=actionsData[i].action_id;
                                obj.action_type=actionsData[i].action_type;
                                obj.create_date=actionsData[i].create_date;
                                obj.ip_address=actionsData[i].ip_address;
                                datas[i]=obj
                            }
                            this.actions=datas;
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
                    },2000);
                    console.log(err)
                })
            },
//            getActionlogByEmail(){
//
//                api.getLogByEmail(this.filters.email)
//                    .then(res=>{
//                        this.total=res.data.total;
//                        let actionsData1=res.data.data;
//                        let data1=[];
//                        for(let i=0;i<actionsData1.length;i++){
//                            let obj={};
//                            obj.user_email=actionsData1[i].user_email;
//                            obj.user_action_email=actionsData1[i].user_action_email;
//                            obj.action_module=actionsData1[i].action_module;
//                            obj.action_id=actionsData1[i].action_id;
//                            obj.action_type=actionsData1[i].action_type;
//                            obj.create_date=actionsData1[i].create_date;
//                            obj.ip_address=actionsData1[i].ip_address;
//                            data1[i]=obj
//                        }
//                        this.actions=data1;
//                        setTimeout(()=>{
//                            this.listLoading=false;
//                        },1000);
//                    }).catch(err=>{
//                        console.log(err)
//                })
//            }
        },
        mounted(){
            this.getActionLog()
        }
    }
</script>

<style scoped>
    @media only screen and (max-height: 635px){
        .tables{
            width:100%;height:440px;overflow-y: scroll;
        }
    }
    @media only screen and (min-height: 635px){
        .tables{
            width:100%;height:520px;overflow-y: scroll;
        }
    }
</style>