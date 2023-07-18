<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24"/>
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空" />
</template>

<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {UserType} from "../models/user";
import UserCardList from "../components/UserCardList.vue";


const isMatchMode = ref<boolean>(false);

//存放用户列表
const userList = ref([]);

const loading= ref(true);

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData ;
  loading.value=true;
  //心动模式，根据标签匹配用户
  if (isMatchMode.value){
    const num =10;
    userListData= await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response){
          console.log('/user/match  success',response);
          // Toast.success('请求成功');
          return response?.data; //返回数据， 可选链操作符，避免数据为 null 或 undefined 时 报错
        })
        .catch(function (error){
          console.error('/user/match  error',error);
          Toast.fail('请求失败');
        })
  }else {
    //普通模式，直接分页查询用户
    userListData= await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response){
          console.log('/user/recommend  success',response);
          // Toast.success('请求成功');
          return response?.data?.records; //返回数据， 可选链操作符，避免数据为 null 或 undefined 时 报错
        })
        .catch(function (error){
          console.error('/user/recommend  error',error);
          Toast.fail('请求失败');
        })
  }
  //数据序列化
  if (userListData){
    userListData.forEach((user : UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value=false;
}

watchEffect( ()=>{
  loadData();
})

</script>
<style scoped>
</style>