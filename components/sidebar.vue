<template>
  <div class="sidebar">
    <div class="list">
    </div>
    <div class="account">
      <avatar width="30" height="30" class="image" :seed="username" :epsilon="0.1" :max-divisions="2" />
      <div class="username">
        <strong>{{ username }}</strong>
      </div>
      <font-awesome-icon class="control" icon="edit" />
      <a class="control" @click="handleEdit">
        <font-awesome-icon icon="cog" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #060e14;
}

@media screen and (max-width: 600px) {
  .sidebar {
    display: none;
  }
}

.list {
  flex: 1;
  padding: 10px;
}

.account {
  display: flex;
  align-items: center;
  min-width: 150px;
  padding: 10px 10px;
  background-color: #0c1b27;
  user-select: none;
}

.username {
  flex: 1;
  padding: 0 10px;
}

.control {
  padding-left: 10px;
  cursor: pointer;
}

.control:hover {
  color: #89b8dc;
}



</style>

<script>
import avatar from 'vue-random-avatar'

export default {
  components: { avatar },
  props: ['username'],

  methods: {
    handleEdit() {
      this.$modal.show('edit');
    }
  }
}

</script>
