<template>
  <form class="chat-control" @submit.prevent="handleSubmit">
    <button type="submit" class="button">SEND</button>
    <input :value="value" @input="handleInput" class="chat-input" type="text" />
  </form>
</template>

<style scoped>
.chat-control {
  display: flex;
  color: rgba(255, 255, 255, 0.6);
  background-color: rgb(15, 32, 45);
  margin: 10px;
  border-radius: 10px;
}

.chat-input {
  box-sizing: border-box;
  flex: 1 0 8em;
  color: rgba(255, 255, 255, 0.6);
  background-color: rgb(15, 32, 45);
  margin: 0;
  border: none;
  border-left: 1px solid rgb(11, 25, 36);
  font-size: 1.0rem;
  padding: 10px;
}

.button {
  flex: 0 0 auto;
}

.chat-input:focus {
  outline: none;
}

.chat-input:placeholder {
  color: rgb(85, 94, 102);
}

</style>

<script>

export default {
  props: ['value'],

  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value)
    },

    handleSubmit(e) {
      this.$emit('submit')
    }
  }
}

</script>
