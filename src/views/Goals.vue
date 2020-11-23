<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_Goals' | localize }}</h3>
      <h4>{{ info.bill | currency('RUB') }}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!goals.length">
      {{ 'NoGoals' | localize }}.
      <router-link to="/goals-editor">{{ 'Add' | localize }}</router-link>
    </p>

    <section v-else>
      <div class="space-between">
        <router-link class="waves-effect waves-light btn cyan lighten-1" to="/goals-editor">
          <i class="material-icons left">add</i>
          {{ 'AddGoal' | localize }}
        </router-link>
        <router-link
          class="btn-small btn"
          to="/g-record"
        >
          <i class="material-icons">edit</i>
        </router-link>
      </div>
      <div v-for="g in goals" :key="g.id">
        <p>
          <strong>{{ g.title }}:</strong>
          {{ 'SavedMoney' | localize }} {{ g.saved | currency }} {{ 'Of' | localize }}
          {{ g.limit | currency }}
        </p>
        <div class="progress" v-tooltip="g.tooltip">
          <div
            class="determinate"
            :class="[g.progressColor]"
            :style="{ width: g.progress + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import localizeFilter from '../filters/localize.filter'
import currencyFilter from '../filters/currency.filter'

export default {
  name: 'Goals',
  data: () => ({
    loading: true,
    goals: [],
  }),
  computed: {
    ...mapGetters(['info']),
  },
  async mounted() {
    const g_records = await this.$store.dispatch('fetchGRecords')
    const goals = await this.$store.dispatch('fetchGoals')

    this.goals = goals.map((g) => {
      const saved = g_records
        .filter((r) => r.goalId === g.id)
        .reduce((total, g_record) => {
          if (g_record.type === 'income') {
            return (total += +g_record.amount)
          } else {
            return (total -= +g_record.amount)
          }
        }, 0)

      const percent = (100 * saved) / g.limit
      const progress = percent > 100 ? 100 : percent
      const progressColor =
        percent < 30 ? 'red' : percent < 90 ? 'yellow' : 'green'

      const tooltipValue = g.limit - saved
      const tooltip = `${
        tooltipValue < 0 ? localizeFilter('MoreThan') : localizeFilter('Stayed')
      } ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...g,
        progress,
        progressColor,
        saved,
        tooltip,
      }
    })

    this.loading = false
  },
}
</script>
