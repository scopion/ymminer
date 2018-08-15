<template>
<div id="app">
  <h1><img src="./assets/ymminer.png" width="50">焱猫矿机信息表</h1>
  <router-view/>
</div>
</template>

<script>
import Global_ from './components/Global'
export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {},
  updated() {},
  // Options / Data
  // data () { return {} },
  // props: [],
  // propsData: {},
  // computed: {},
  // methods: {},
  // watch: {},
  // Options / DOM
  // el () {},
  // template: '',
  // render () {},
  // Options / Lifecycle Hooks
  // beforeCreate () {},
  // created () {},
  // beforeMount () {},
  // mounted () {},
  // beforeUpdate () {},
  // updated () {},
  // activated () {},
  // deactivated () {},
  // beforeDestroy () {},
  // destroyed () {},
  // Options / Assets
  // directives: {},
  // filters: {},
  // components: {},
  // Options / Misc
  // parent: null,
  // mixins: [],
  // name: '',
  // extends: {},
  // delimiters: [ '{{', '}}' ],
  // functional: false
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

h1 {
  margin-bottom: 1rem
}

img {
  vertical-align: middle;
  margin-bottom: 0.2rem;
}
</style>
