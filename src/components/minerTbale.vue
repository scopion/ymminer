<template>
<div style="width: 95%;margin:0 auto">
    <el-table
    ref="table"
    header-align="center"
    v-loading="loading"
    element-loading-text="数据加载中......"
    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 180rem;margin-top:1rem"
    height="50rem"
    @selection-change="SelectionChange"
    @sort-change = "sortChange"
    :default-sort = "{prop: 'OfflineTime', order: 'descending'}"
    @select-all="selectAll" :row-class-name="tableRowClassName" resizable border>
    <el-table-column fixed type="index" label="编号" :index="indexMethod" width="60">
    </el-table-column>
    <!-- <el-table-column fixed type="selection" width="50">
    </el-table-column> -->
    <el-table-column fixed prop="ID" label="ID" width="150">
    </el-table-column>
    <el-table-column fixed prop="Online" label="在线/离线" width="100" :formatter="judge">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.Online === '在线' ? 'success' : 'danger'"
          >{{scope.row.Online}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed prop="Worker" label="矿工" width="80">
    </el-table-column>
    <el-table-column fixed sortable="custom" prop="OfflineTime" label="离线时间" width="150" :formatter="timeNew">
    </el-table-column>
    <el-table-column fixed sortable="custom" prop="CardsCount" label="显卡" width="120">
    </el-table-column>
    <el-table-column prop="IPAddress" label="IP地址" width="150">
    </el-table-column>
    <el-table-column  prop="RunningTime" label="运行时间" width="150" :formatter="time">
    </el-table-column>
    <el-table-column  prop="MiningTime" label="挖矿时间" width="150" :formatter="time">
    </el-table-column>
    <el-table-column prop="Temperature" label="温度" width="420">
    </el-table-column>
    <el-table-column prop="FanSpeed" label="风扇" width="520">
    </el-table-column>
    <el-table-column prop="Version" label="软件版本" width="120">
    </el-table-column>
    <el-table-column prop="KernelVersion" label="内核版本" width="120">
    </el-table-column>
    <el-table-column prop="MasterCoinType" label="主币" width="120">
    </el-table-column>
    <el-table-column prop="MasterWallet" label="主币钱包" width="380">
    </el-table-column>
    <el-table-column prop="MasterPool" label="主币矿池" width="520">
    </el-table-column>
    <el-table-column prop="BackupPool" label="主币备用矿池" width="350">
    </el-table-column>
    <el-table-column prop="MasterTotalPower" label="主币总算力" width="120">
    </el-table-column>
    <el-table-column prop="MasterEachPower" label="主币单卡算力" width="700">
    </el-table-column>
    <el-table-column prop="MasterAccept" label="主币接收" width="120">
    </el-table-column>
    <el-table-column prop="MasterReject" label="主币拒绝" width="120">
    </el-table-column>
  </el-table>
  <!--分页 -->
  <div class="block margin">
    <!-- <el-button class="pull-right" size="small" type="info" @click="toggleSelection()">反选</el-button>
    <el-button class="pull-right" size="small" type="danger" style="margin-right:1rem" @click="faildSelection()">筛选打款失败项目</el-button> -->
    <el-button class="pull-right" size="small" type="info" style="margin-right:1rem" @click="refresh()"><i class="el-icon-refresh"></i>数据刷新</el-button>
    <span class="dnstration">
      <el-radio-group v-model="radio" size="small" @change="radioChange()">
        <el-radio label="1" border>在线矿机 (&nbsp;{{onlineMiner.length}}&nbsp;)</el-radio>
        <el-radio label="2" border>离线矿机 (&nbsp;{{offlineMiner.length}}&nbsp;)</el-radio>
        <el-radio label="3" border>所有矿机 (&nbsp;{{totalLength}}&nbsp;)</el-radio>
      </el-radio-group>
    </span>
    <el-pagination
    class="pull-left"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[20,50,100]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
  </div>
</div>
</template>

<script>
import Global_ from './Global'
export default {
  data() {
    return {
      baseUrl: './public/index.php',
      // baseUrl: '../../static/data.json',
      tableData: [],
      faildTableData: [],
      multipleSelection: [], //多选框的值
      gas: '',
      gasprice: '',
      currentPage: 1,
      pagesize: 20, //初始表格每页展示数量
      total: 5, //初始表格总数
      totalLength: 5, //初始表格总数
      gridData: [], //初始表格每页展示数量
      childVisible: false,
      hashList: [], //post的哈希数组
      loading: false,
      minerTotal: Global_.minerTotal,
      onlineMiner: [],
      offlineMiner: [],
      radio: '3',
      keySort:'',
    }
  },
  methods: {
    getData: function() {
      let that = this
      let param = window.location.search
      that.loading = true
      console.log(param)
      that.axios.get(this.baseUrl + param) //赋值可以用箭头函数 或者是然后在内部方法中使用该属性(let that = this)
        .then((res) => {
          console.log(res.data)
          that.onlineMiner = []
          that.offlineMiner = []
          that.tableData = []
          that.totalLength = res.data.length
          res.data.forEach((item) => {
            item.nowTime = parseInt(Date.parse(new Date()))/1000
            if (item.Online) {
              item.Online = "在线"
              that.onlineMiner.push(item)
            } else {
              item.Online = "离线"
              that.offlineMiner.push(item)
            }
          })
          if (that.radio === '1') {
            res.data.forEach((item) => {
              that.tableData = that.onlineMiner
              that.total = that.onlineMiner.length
              that.currentPage = 1
            })
          } else if (that.radio === '2') {
            res.data.forEach((item) => {
              that.tableData = that.offlineMiner
              that.total = that.offlineMiner.length
              that.currentPage = 1
            })
          } else {
            that.tableData = res.data
            that.total = res.data.length
          }
          if (res.data) {
            setTimeout(() => {
              this.loading = false
            }, 100)
          }
        }).catch((res) => {})
    },
    refresh: function() {
      this.loading = true
      setTimeout(() => {
        this.onlineMiner = []
        this.offlineMiner = []
        this.tableData = []
        this.getData()
        this.$message({
          message: '数据已经更新',
          type: 'success',
        })
      }, 100)
    },
    indexMethod(index) {
      return index * 1 + 1;
    },
    formatter(row, column) {
      return row.address;
    },
    judge(data) {
      //Online 布尔值
      return data.Online ? '在线' : '离线'
    },
    time(row, column, cellValue, index) {
      var demo = cellValue
      var num = parseInt(demo.substring(2, 10), 16)
      if (demo == '') {
        num = 0;
      }
      var day = Math.floor(num / 1000 / 86400)
      if (day >= 1) {
        var hour = parseInt((num / 1000 - 86400 * day) / 3600)
        if (hour >= 1) {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        } else {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        }
      } else {
        var hour = parseInt((num / 1000 - 86400 * day) / 3600)
        if (hour >= 1) {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        } else {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        }
      }
      return day + '天' + hour + '时' + min + '分' + sec + '秒'
    },
    timeNew(row, column, cellValue, index){
      var num = Math.abs(parseInt(Date.parse(new Date())/1000) - cellValue); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      if (cellValue == '' || num<=300 ) {
        num = 0;
      }
      if(num<=86400){
        num = num * 1000
      }
      var day = Math.floor(num / 1000 / 86400)
      if (day >= 1) {
        var hour = parseInt((num / 1000 - 86400 * day) / 3600)
        if (hour >= 1) {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        } else {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        }
      } else {
        var hour = parseInt((num / 1000 - 86400 * day) / 3600)
        if (hour >= 1) {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        } else {
          var min = parseInt((num / 1000 - 86400 * day - 3600 * hour) / 60)
          if (min >= 1) {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          } else {
            var sec = parseInt(((num / 1000) - 86400 * day - 3600 * hour - 60 * min))
          }
        }
      }
      return day + '天' + hour + '时' + min + '分' + sec + '秒'
    },
    radioChange(e) {
      console.log("已选中" + this.radio)
      if (this.radio === '1') {
        this.getData()
      } else if (this.radio === '2') {
        this.getData()
      } else {
        this.tableData = []
        this.getData()
      }
    },
    sortChange(val){//排序
      let that = this
      that.keySort = val.prop
      let keyS = that.keySort
      function up(x,y){//升序
            return x[val.prop] - y[val.prop]
      }
      function down(x,y){//降序
            return y[val.prop] - x[val.prop]
      }
      if(val.order=="ascending"){//升序
          let newableData = []
          that.tableData.sort(up).forEach((item) => {
            console.log(item[keyS])
            newableData.push(item)
          })
          that.tableData = newableData
          console.log(that.tableData)
      }else{
        let newableData = []
        that.tableData.sort(down).forEach((item) => {
          console.log(item[keyS])
          newableData.push(item)
        })
        that.tableData = newableData
        console.log(that.tableData)
      }
    },
    filterTag(value, row) {
      return row.Online === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
          let i = 1
          i++
          console.log(i)
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    SelectionChange(selection, row) {
      this.multipleSelection = selection
      this.$message({
        type: 'success',
        showClose: true,
        message: '已选择' + this.multipleSelection.length + '项',
      })
    },
    selectAll(selection) {
      console.log(selection)
    },
    //---------------------------------------------------------------------分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    //---------------------------------------------------------------------发送信息
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      } else if (rowIndex === 5) {
        return 'warning-row';
      } else if (rowIndex === 7) {
        return 'success-row';
      } else if (rowIndex === 9) {
        return 'warning-row';
      }
      return '';
    },
    headerDragend(newWidth, oldWidth, column, event) {
      console.log(newWidth)
      console.log(oldWidth)
      console.log(column)
      console.log(event)
    }
  },
  computed: {

  },
  components: {},
  mounted: function() {
    this.getData();
  },
}
</script>

<style lang="less">
td {
    text-align: left;
}
.block {
    overflow: hidden;
}
.margin {
    margin: 2rem 0;
}
.pull-right {
    float: right;
}
.pull-left {
    float: left;
}
.el-row {
    margin: 2rem 0;
    &:last-child {
        margin-bottom: 0;
    }
    .el-col {
        border-radius: 4px;
    }
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track-piece {
    background-color: #ebebeb;
}

::-webkit-scrollbar-thumb {
    transition: background-color 0.5s;
}

::-webkit-scrollbar-thumb:vertical {
    transition: background-color 0.5s;
    height: 32px;
    background-color: #a9a9a9;
    border-radius: 15px;
}

::-webkit-scrollbar-thumb:hover {
    transition: background-color 0.5s;
    height: 32px;
    background-color: #888;
}

::-webkit-scrollbar-thumb:horizontal {
    width: 32px;
    background-color: #a9a9a9;
    border-radius: 15px;
}
</style>
