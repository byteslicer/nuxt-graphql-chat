<template>
  <div class="sidebar">
    <div class="list">
      List
    </div>
    <div class="account">
      <Avatar class="image" :seed="username" />
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
import Avatar from '@/components/avatar'

export default {
  components: { Avatar },
  props: ['username'],

  methods: {
    handleEdit() {
      this.$modal.show('edit');
    }
  }
}

</script>
