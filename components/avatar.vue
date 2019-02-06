<template>
  <svg height="32" width="32" viewBox="0 0 160 160">
      <g>
        <circle v-for="(circle, index) in circles"
          :key="index"
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="transparent"
          :stroke="circle.color"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circle.strokeDashOffset"
          :transform="circle.transform"
          shape-rendering="optimizeQuality">
        </circle>
      </g>
  </svg>
</template>

<style scoped>
</style>

<script>
import Random from '@/helper/random'

export default {
  props: ['seed'],

  data() {
    return {
      colorPalette: ["#1b85b8", "#5a5255", "#559e83", "#ae5a41", "#c3cb71"],
      cx: 80,
      cy: 80,
      radius: 60,
      strokeWidth: 30
    }
  },

  computed: {
    isServer() {
      return process.server
    },

    /*rng() {
      return new Random(this.seed);
    },*/

    circumference() {
      return 2 * Math.PI * this.radius
    },

    circles() {
      const rng = new Random(this.seed + 'salty')
      const circumference = this.circumference
      const sortedValues = this.sortedValues
      let angleOffset = -90

      return [...this.sortedValues(rng)].map((x, i) => {
        let resOffset = angleOffset
        angleOffset = x * 360 + angleOffset
        let strokeDiff = x * circumference
        return {
          percentage: x,
          transform: `rotate(${resOffset}, ${this.cx}, ${this.cy})`,
          color: rng.select(this.colorPalette),
          strokeDashOffset: circumference - strokeDiff
        }
      })
    },

    /*calculateOffset() {
      var angleOffset = -90

      return this.sortedValues.map(x => {
        let res = this.angleOffset
        this.angleOffset = x * 360 + this.angleOffset
        return res
      })
    },*/

    /*colors() {
      return this.sortedValues.map(() => this.rng.select(this.colorPalette))
    },*/

    /*filteredColor() {
      let result = this.colors

      for (var i = 1; i < result.length; i++) {
        if(result[i] === result[i-1]) {
          result[i] = this.rng.select(this.colorPalette)
        }
      }
      return result
    }*/
  },

  methods: {
    * sortedValues(rng) {
      let x = 1
      while(x > 0) {
        let part = Math.min(x, rng.number())
        yield part
        x -= part
      }
    },

    calculateStrokeDashOffset(percentage, circumference) {
      const strokeDiff = percentage * circumference
      return circumference - strokeDiff
    }
  },

  mounted() {

  }

}

</script>
