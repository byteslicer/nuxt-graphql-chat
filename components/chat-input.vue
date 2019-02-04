<template>
  <form class="chat-control" @submit.prevent="handleSubmit">
    <button type="submit" class="button">SEND</button>
    <input :value="value" @input="handleInput" class="input" type="text" />
  </form>
</template>

<style scoped>
.chat-control {
  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.6);
  background-color: #17374f;
  border-radius: 10px;
}

.input {
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  flex: 1 0 8em;
  color: rgba(255, 255, 255, 0.6);
  background-color: #17374f;
  margin: 0;
  border: none;

  border-left: 1px solid #1d4462;
  font-size: 1.0rem;

  border-radius: 0 5px 5px 0;
}

.button {
  height: 100%;
  padding: 0 10px;
  flex: 0 0 auto;
}

.input:focus {
  outline: none;
}

.input:placeholder {
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
