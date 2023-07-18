<template>
  <div
          id="teamCardList"
  >
    <van-card
        v-for="team in props.teamList"
        :thumb="IU"
        :desc="team.description"
        :title="`${team.name}`"
    >
      <template #tags>
        <van-tag plain type="danger"  style="margin-right: 8px; margin-top: 8px" >
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
              {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div>
          {{'最大人数：'+team.maxNum}}
        </div>
        <div v-if="team.expireTime">
          {{'过期时间：'+team.expireTime}}
        </div>
        <div v-if="team.createTime">
          {{'创建时间：'+team.createTime}}
        </div>
      </template>
      <template #footer>
<!--        仅非队伍创建人可见，且未加入队伍的人可见-->
        <van-button size="small" type="primary" v-if="team.userId !== currentUser?.id && !team.hasJoin"  plain
                    @click="preJoinTeam(team)">
            加入队伍
        </van-button>
<!--         仅创建人可见-->
        <van-button v-if="team.userId === currentUser?.id" size="small" plain
                    @click="doUpdateTeam(team.id)">
            更新队伍
        </van-button>
<!--仅创建人可见-->
        <van-button v-if="team.id !== currentUser?.id && team.hasJoin" size="small" plain
                    @click="doQuitTeam(team.id)">
            退出队伍
        </van-button>
<!--        创建人不可见，仅已加入队伍的人可见-->
        <van-button v-if="team.userId === currentUser?.id" size="small" type="danger" plain
                    @click="doDeleteTeam(team.id)">
            解散队伍
        </van-button>
      </template>
    </van-card>
      <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
          <van-field v-model="password" placeholder="请输入密码" />
      </van-dialog>
  </div>
</template>

<script setup lang="ts">


import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team";
import IU from "../assets/IU.png";
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {getCurrentUser} from "../services/user";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

interface TeamCardListProps{
  teamList: TeamType[];
}

//withDefaults给属性附默认值
const props= withDefaults(defineProps<TeamCardListProps>(),{
  // @ts-ignore
 teamList:[] as TeamType[],
});

// 弹窗
const VanDialog = Dialog.Component;
const showPasswordDialog = ref(false);
const password = ref('');


const joinTeamId = ref(0);
const currentUser = ref();

const router = useRouter();

onMounted(async () => {
    currentUser.value = await getCurrentUser();
})

const preJoinTeam = (team: TeamType) => {
    joinTeamId.value = team.id;
    if (team.status === 0) {
        doJoinTeam()
    } else {
        showPasswordDialog.value = true;
    }
}

const doJoinCancel = () => {
    joinTeamId.value = 0;
    password.value = '';
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
    if (!joinTeamId.value) {
        return;
    }
    const res = await myAxios.post('/team/join', {
        teamId: joinTeamId.value,
        password: password.value
    });
    if (res?.code === 0) {
        Toast.success('加入成功');
        doJoinCancel();
    } else {
        Toast.fail('加入失败' + (res.description ? `，${res.description}` : ''));
    }
}

/**
 * 跳转至更新队伍页面
 * @param id
 */
const doUpdateTeam = (id: number) =>{
  router.push({
    path: '/team/update',
    query:{
      id,
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `,${res.description}` : ''));
  }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id,
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `,${res.description}` : ''));
  }
}

</script>

<style scoped>

#teamCardList :deep(.van-image__img){
  width: 100%;
  height: 130%;
  object-fit: unset;
}

</style>