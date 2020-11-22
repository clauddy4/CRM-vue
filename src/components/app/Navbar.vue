<template>
  <nav class="navbar lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('click')">
          <i class="material-icons">dehaze</i>
        </a>
        <span class="black-text">{{ date | date('datetime') }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i
                >{{ 'ProfileTitle' | localize }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i
                >{{ 'Exit' | localize }}
              </a>
            </li>
            <li>
              <span href="#" class="black-text navbar-span">
                <i class="material-icons">language</i
                >{{ 'Language' | localize }}
              </span>
              <form @submit.prevent="submitHandler">
                <div class="switch">
                  <label>
                    English
                    <input type="checkbox" v-model="isRuLocale" />
                    <span class="lever"></span>
                    Русский
                  </label>
                </div>
              </form>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Navbar',
  data: () => ({
    date: new Date(),
    interval: null,
    dropdown: null,
    isRuLocale: true,
  }),
  methods: {
    ...mapActions(['updateInfo']),
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login?message=logout')
    },
    async submitHandler() {
      try {
        await this.updateInfo({
          locale: this.isRuLocale ? 'ru-RU' : 'en-US',
        })
      } catch (e) {}
    },
  },
  watch: {
      isRuLocale() {
        this.updateInfo({
          locale: this.isRuLocale ? 'ru-RU' : 'en-US',
        })
      }
  },
  computed: {
    ...mapGetters(['info']),
    name() {
      return this.$store.getters.info.name
    },
  },
  mounted() {
    this.isRuLocale = this.$store.getters.info.locale === 'ru-RU'
    setTimeout(() => {
      M.updateTextFields()
    })
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false,
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
    if (this.dropdown && this.dropdown.destroy) this.dropdown.destroy()
  },
}
</script>

<style scoped></style>
