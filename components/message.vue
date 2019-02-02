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
  </article>
</template>

<style scoped>
  .top-line {

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
    background-color: rgb(23, 43, 58);
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 6px;
  }
</style>

<script>
import moment from 'moment'

import avatar from '@/components/avatar'

export default {
  components: { avatar },
  props: ['author', 'message', 'time'],

  filters: {
    fromNow: function (date) {
      return moment(date).calendar()
    }
  }
}

</script>
