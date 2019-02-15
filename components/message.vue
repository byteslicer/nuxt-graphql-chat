<template>
  <article class="media">
    <figure class="media-left">
      <avatar
        width="30"
        height="30"
        :seed="author"
        :epsilon="0.1"
        :max-divisions="2"
      />
    </figure>
    <div class="media-content">
      <div class="content">
        <div class="top-line">
          <div class="name">
            <strong>{{ author }}</strong>
          </div>
          <div class="time">
            <small>{{ time | fromNow }}</small>
          </div>
        </div>
        <p class="message-box">
          {{ message }}
        </p>
      </div>
    </div>
    <img v-if="loading && timeout" class="loader" src="loader.svg">
  </article>
</template>

<style scoped>
  .top-line {
    user-select: none;
  }
  .loader {

    padding: 3px 10px;
  }

  .name {
    display: inline-block;
    padding-right: 10px;
  }

  .time {
    float: right;
    display: inline-block;
  }

  .media {
    padding-top: 10px;
    padding-right: 10px;
    align-items: flex-start;
    display: flex;
    text-align: left;
  }

  .media-content {
    min-width: 12vw;
  }

  @media screen and (max-width: 600px) {
    .media-content {
      flex: 1;
    }
  }

  .media-left {
    padding: 0 10px;
  }

  .message-box {
    background-color: #17374f;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 6px;
    word-wrap: break-word;
  }
</style>

<script>
import moment from 'moment';
import avatar from 'vue-random-avatar';

export default {
  components: { avatar },

  filters: {
    fromNow(date) {
      return moment(date).calendar();
    },
  },
  props: {
    author: { type: String, default: '' },
    message: { type: String, default: '' },
    time: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  },

  data() {
    return {
      timeout: false,
    };
  },

  mounted() {
    if (this.loading) {
      setTimeout(() => {
        this.timeout = true;
      }, 100);
    }
  },
};
</script>
