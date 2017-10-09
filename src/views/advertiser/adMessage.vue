<template>
	<section>
		<!--列表-->
		<el-table :data="users" v-loading="listLoading" @selection-change="selsChange"
                  id="adtable" highlight-current-row border height="440" max-height="440" :default-sort="{prop: 'create_date', order: 'descending'}">

			<el-table-column type="expand">
				<template scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="开票项目:">
                            <span>{{ props.row.name}}</span>
                        </el-form-item>
                        <el-form-item label="发票类型:">
                            <span>{{ props.row.type}}</span>
                        </el-form-item>
						<el-form-item label="开票主体:">
							<span>{{ props.row.entity_name}}</span>
						</el-form-item>
						<el-form-item label="开票企业:">
							<span>{{ props.row.company_name }}</span>
						</el-form-item>
						<el-form-item label="企业税号:">
							<span>{{ props.row.tax_no }}</span>
						</el-form-item>
						<el-form-item label="注册地址:">
							<span>{{ props.row.address }}</span>
						</el-form-item>
                        <el-form-item label="注册电话:">
                            <span>{{ props.row.telephone }}</span>
                        </el-form-item>
						<el-form-item label="开户银行:">
							<span>{{ props.row.bank_name }}</span>
						</el-form-item>
						<el-form-item label="银行账号:">
							<span>{{ props.row.bank_no}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>

			<!--<el-table-column type="selection" width="40px" >-->
			<!--</el-table-column>-->
			<el-table-column prop="user_id" width="90px" label="用户ID" sortable>
			</el-table-column>
            <el-table-column prop="email" width="175px" label="邮箱">
            </el-table-column>
            <el-table-column prop="balance" width="95px" label="余额"></el-table-column>
            <el-table-column prop="qq" width="125px" label="QQ" >
            </el-table-column>
            <el-table-column prop="phone" width="125px" label="手机号" >
            </el-table-column>
            <el-table-column prop="statement_type" width="95px" :formatter="formatStatement" label="发票类型" >
            </el-table-column>
            <el-table-column prop="need_invoice" :formatter="formatNeed" label="开票" >
            </el-table-column>
            <el-table-column prop="zonst_user_id" width="95px" label="业务ID" >
            </el-table-column>

            <el-table-column prop="create_date" width="170px" label="创建时间" sortable>
            </el-table-column>

			<el-table-column label="操作"  width="150px" fixed="right">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="sizes,prev, pager, next,jumper" style="float:right;"
                           @current-change="handleCurrentChange"
                           @size-change="pageSizeChange"
                           :page-size="page_size"
                           :page-sizes="[8, 10,20]"
                           :total="total">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑完善" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" class="editForm">
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="editForm.email" readonly unselectable="on" ></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="editForm.qq"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="开票类型" >
                    <el-radio v-for="(key,value) in statements" :key="value" :label="parseInt(value)" v-model="editForm.statement_type" name="type">
                        {{key}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="开票" >
                    <el-radio v-for="(key,value) in needs" :key="value" :label="parseInt(value)" v-model="editForm.need_invoice" name="type">
                        {{key}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="业务ID" prop="zonst_user_id">
                    <el-input v-model="editForm.zonst_user_id" readonly unselectable="on"></el-input>
                </el-form-item>
                <el-form-item label="余额" prop="balance">
                    <el-input v-model="editForm.balance" readonly unselectable="on"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_date">
                    <el-input v-model="editForm.create_date" readonly unselectable="on"></el-input>
                </el-form-item>

                <!--开票信息-->
                <el-form-item label="开票项目" prop="name" style="margin-top:20px;">
                    <el-select v-model="editForm.name" placeholder="请选择开票项目名称" style="width: 260px;height: 36px;">
                        <el-option
                                v-for="(key,value) in invoice_name" :key="value" :label="key" :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发票类型">
                    <el-radio v-model="editForm.type" v-for="(key,value) in invoices" :key="value"
                              :label="parseInt(value)" id="radio">
                        {{key}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="开票主体" prop="entity_name" style="margin-top:20px;">
                    <el-select v-model="editForm.entity_name" placeholder="请选择开票主体" style="width: 260px;height: 36px;">
                        <el-option
                                v-for="(key,value) in entity_name" :key="value" :label="key" :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票企业" prop="company_name">
                    <el-input v-model="editForm.company_name"></el-input>
                </el-form-item>
                <el-form-item label="企业税号" prop="tax_no">
                    <el-input v-model="editForm.tax_no"></el-input>
                </el-form-item>
                <el-form-item label="注册地址" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
                <el-form-item label="注册电话" prop="telephone">
                    <el-input v-model="editForm.telephone"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="bank_name">
                    <el-input v-model="editForm.bank_name"></el-input>
                </el-form-item>
                <el-form-item label="银行帐号" prop="bank_no">
                    <el-input v-model="editForm.bank_no"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
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
            let checkType=(rule,value,callback)=>{
                if (!document.getElementById('radio').checked) {
                    return callback(new Error('请选择发票类型'));
                }
                callback();
            };
            let bankNoValidate=(rule,value,callback)=>{
                if(!(/^\d{16}|\d{17}|\d{18}|\d{19}$/.test(value))){
                    return callback(new Error('银行卡号格式不正确'));
                }
                callback();
            };
			return {
			    statements:JSON.parse(sessionStorage.getItem('statement_type')),
                needs:JSON.parse(sessionStorage.getItem('need_invoice')),
                invoices:JSON.parse(sessionStorage.getItem('invoice_type')),
                invoice_name:JSON.parse(sessionStorage.getItem('invoice_name')),
                entity_name:JSON.parse(sessionStorage.getItem('entity_name')),

                //查询返回的数据
				users: [],
                //查询返回的总条目
				total: 0,
				page: 1,
                page_size:10,
				listLoading: false,
                //列表选中列
				sels: [],
                //编辑界面是否显示
				editFormVisible: false,
				editLoading: false,
				editFormRules: {
                    qq:[
                        {required: true, message: 'QQ不可为空', trigger: 'blur'},
                        {validator:qqValidate,trigger:'blur'}
                    ],
                    phone:[
                        {required: true, message: '手机号码不可为空', trigger: 'blur'},
                        {validator:phoneValidate,trigger:'blur'}
                    ],
                    statement_type:[
                        {required: true, message: '请选择开票类型', trigger: 'change'},
                    ],
                    need_invoice:[
                        {required: true, message: '请选择是否开票', trigger: 'change'},
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
				//编辑界面数据
                editForm:{
                    //account
                    email:'',
                    qq:'',
                    phone:'',
                    statement_type:'',
                    need_invoice:'',
                    zonst_user_id:'',
                    balance:'',
                    create_date:'',
                    //invoice info
                    name:'',
                    type:'',
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
		methods: {
            formatNeed(row){
                return row.need_invoice===0?'否':'是'
            },
            formatStatement(row){
                return row.statement_type===0?'对私':'对公'
            },

            pageSizeChange(val) {
                this.page_size= val;
                this.getUsers();
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
            selsChange: function (sels) {
                this.sels = sels;
            },
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
                    page_size:this.page_size,
				};
				this.listLoading = true;
				api.getAccountInfo(para)
					.then((res) => {
				    if(res.data.status===0){
//				        console.log(res.data.data);
					this.total = res.data.total;
					let datashow= res.data.data;
					let datasource=[];
					for(let i=0;i<datashow.length;i++){
                        let obj={};
                        obj.user_id=datashow[i].user_id;
                        obj.statement_type=datashow[i].statement_type;
                        obj.need_invoice=datashow[i].need_invoice;
                        obj.zonst_user_id=datashow[i].zonst_user_id;
                        obj.balance=Number(datashow[i].balance).toFixed(2);
                        obj.create_date=datashow[i].create_date;
                        obj.qq=datashow[i].qq;
                        obj.phone=datashow[i].phone;
                        obj.email=datashow[i].email;
                        obj.name=(datashow[i].invoice===null?'无':datashow[i].invoice.name);
                        obj.type=(datashow[i].invoice===null?'无':(datashow[i].invoice.type===1)?'普通发票':'增值税专用专票');
                        obj.entity_name=(datashow[i].invoice===null?'无':datashow[i].invoice.entity_name);
                        obj.company_name=(datashow[i].invoice===null?'无':datashow[i].invoice.company_name);
                        obj.tax_no=(datashow[i].invoice===null?'无':datashow[i].invoice.tax_no);
                        obj.address=(datashow[i].invoice===null?'无':datashow[i].invoice.address);
                        obj.telephone=(datashow[i].invoice===null?'无':datashow[i].invoice.telephone);
                        obj.bank_name=(datashow[i].invoice===null?'无':datashow[i].invoice.bank_name);
                        obj.bank_no=(datashow[i].invoice===null?'无':datashow[i].invoice.bank_no);
                        datasource[i]=obj;
					}
					this.users=datasource;

                        setTimeout(()=>{
                            this.listLoading=false;
                        },500);
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
                            message:'未查询到数据'+err,
                            type:'error'
                        });
                        this.listLoading=false
                    },1000);
				    console.log(err)
                });
			},
			//显示编辑界面
			handleEdit: function (index,row) {
				this.editFormVisible = true;
                console.log(index);
                console.log(row);
				api.getAccountInfoByUserId(row.user_id)
                    .then(res =>{
                        if(res.data.status===0){
                            this.editForm={
                            user_id:res.data.data[0].user_id,
                            statement_type:res.data.data[0].statement_type,
                            need_invoice:res.data.data[0].need_invoice,
                            zonst_user_id:res.data.data[0].zonst_user_id,
                            balance:Number(res.data.data[0].balance).toFixed(2),
                            create_date:res.data.data[0].create_date,
                            qq:res.data.data[0].qq,
                            phone:res.data.data[0].phone,
                            email:res.data.data[0].email,
                            name:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.name),
                            type:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.type),
                            entity_name:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.entity_name),
                            company_name:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.company_name),
                            tax_no:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.tax_no),
                            address:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.address),
                            telephone:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.telephone),
                            bank_name:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.bank_name),
                            bank_no:(res.data.data[0].invoice===null?'':res.data.data[0].invoice.bank_no),
                            };
                        }
                    }).catch(err =>{
                        this.$message({
                            message:'获取信息失败'
                        });
                    console.log(err)
                })
			},

			//编辑
			editSubmit: function (formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {})
							.then(() => {
							this.editLoading = true;
                                let datas={
                                    user_id:this.editForm.user_id,
                                    need_invoice:parseInt(this.editForm.need_invoice),
                                    statement_type:parseInt(this.editForm.statement_type),
                                    zonst_user_id:parseInt(this.editForm.zonst_user_id),
//                                    balance:this.editForm.balance,
                                    create_date:this.editForm.create_date,
                                    qq:this.editForm.qq,
                                    phone:this.editForm.phone,
                                    email:this.editForm.email,
                                    invoice:{
                                        name:this.editForm.name,
                                        type:parseInt(this.editForm.type),
                                        entity_name:this.editForm.entity_name,
                                        company_name:this.editForm.company_name,
                                        tax_no:this.editForm.tax_no,
                                        address:this.editForm.address,
                                        telephone:this.editForm.telephone,
                                        bank_name:this.editForm.bank_name,
                                        bank_no:this.editForm.bank_no
                                    },
                                };
//                                console.log(datas);
							api.editUser(JSON.stringify(datas))
                                .then((res) => {
							    if(res.data.status===0){
                                this.editLoading = false;
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							}else{
                                    this.editLoading = false;
                                    this.$message({
                                        message: '修改出错'+res.data.msg,
                                        type: 'error'
                                    })
                                }}).catch((error) =>{

                                this.$message({
                                    message: '修改失败'+error,
                                    type: 'error'
                                });
                                this.editLoading = false;
                                console.log(error)
                            });
						});
					}
				});
			},
            //删除
            handleDel: function (index,row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {

                    this.listLoading = true;
                    let para =  this.users[index].user_id;
                    api.removeUser(para)
                        .then((res) => {
                            this.listLoading = false;
//                            console.log(this.users[index].user_id);
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getUsers();
                        }).catch((error) => {
                        this.listLoading = false;
                        this.$message({
                            message: '暂不支持删除',
                            type: 'warning'
                        });

                        console.log(error)
                    });
                });
            },
			//批量删除
//			batchRemove: function () {
//				var ids = this.sels.map(item => item.id).toString();
//				this.$confirm('确认删除选中记录吗？', '提示', {
//					type: 'warning'
//				}).then(() => {
//					this.listLoading = true;
//					//NProgress.start();
//					let para = { ids: ids };
//					api.batchRemoveUser(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//						this.$message({
//							message: '删除成功',
//							type: 'success'
//						});
//						this.getUsers();
//					});
//				}).catch((error) => {
//				    console.log(error)
//				});
//			}
		},
		mounted() {
			this.getUsers();
	}}


</script>

<style scoped>

    @media only screen and (max-height: 635px){
        #adtable{
        width:100%;height:440px;overflow-y: scroll;
    }
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
        .editForm{
            width: 340px;
            margin: 0 auto;
        }
        .dialog-footer{
            margin-right:180px;
        }
    }
    @media only screen and (min-height: 635px){
        #adtable{
        width:100%;height:520px;overflow-y: scroll;
    }
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
        .editForm{
            width: 340px;
            margin: 0 auto;
        }
        .dialog-footer{
            margin-right:180px;
        }

      }
</style>