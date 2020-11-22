<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_Goals' | localize }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />

      <div v-else class="row">
        <GoalCreate @created="addNewGoal" />

        <GoalEdit
          v-if="goals.length"
          :goals="goals"
          :key="goals.length + updateCount"
          @updated="updateGoals"
        />
        <p v-else class="center">{{ 'NoCategories' | localize }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import GoalCreate from '../components/GoalCreate'
import GoalEdit from '../components/GoalEdit'

export default {
  name: 'Goals',
  components: {
    GoalCreate,
    GoalEdit,
  },
  data: () => ({
    goals: [],
    loading: true,
    updateCount: 0,
  }),
  methods: {
    addNewGoal(goal) {
      this.goals.push(goal)
    },
    updateGoals(goal) {
      const idx = this.goals.findIndex((c) => c.id === goal.id)
      this.goals[idx].title = goal.title
      this.goals[idx].limit = goal.limit
      this.updateCount++
    },
  },
  async mounted() {
    this.goals = await this.$store.dispatch('fetchGoals')
    this.loading = false
  },
}
</script>
