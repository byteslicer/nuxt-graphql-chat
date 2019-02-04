<template>
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <avatar :seed="author"></avatar>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <div class="top-line">
          <div class="name"><strong>{{ this.author }}</strong></div>
          <div class="time"><small>{{ this.time | fromNow }}</small></div>
        </div>
        <p class="message-box">
          {{ this.message }}
        </p>
      </div>
    </div>
    <loader v-if="loading && timeout" class="loader" />
  </article>
</template>

<style scoped>
  .top-line {

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

  .image {
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
import moment from 'moment'

import loader from '@/components/small-loader'
import avatar from '@/components/avatar'

export default {
  components: { avatar, loader },
  props: ['author', 'message', 'time', 'loading'],

  data() {
    return {
      timeout: false
    }
  },

  mounted() {
    if(this.loading) {
      setTimeout(() => {
       this.timeout = true
      }, 100)
    }
  },

  filters: {
    fromNow: function (date) {
      return moment(date).calendar()
    }
  }
}

</script>
