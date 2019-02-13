<template>
  <div>
    <transition enter-active-class="animated headShake" leave-active-class="animated fadeOut">
      <div v-if="message" class="alert">{{ message }}</div>
    </transition>
  </div>
</template>

<style scoped>

.alert {
  padding: 10px;
  background-color: #17374f;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-left: 5px solid #990000;
}

</style>

<script>

export default {
  props: ['message', 'level']
}

</script>
