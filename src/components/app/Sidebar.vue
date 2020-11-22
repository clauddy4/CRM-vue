<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      class="router-link"
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
      ><a href="#" class="waves-effect waves-light pointer"
        ><i :class="link.icon"></i>{{ link.title }}</a
      >
    </router-link>
  </ul>
</template>

<script>
import localizeFilter from '../../filters/localize.filter'

export default {
  name: 'Sidebar',
  props: ['value'],
  data: () => ({
    links: [
      {
        title: localizeFilter('Menu_Bill'),
        url: '/',
        icon: 'fas fa-wallet',
        exact: true,
      },
      {
        title: localizeFilter('Menu_History'),
        url: '/history',
        icon: 'fas fa-history',
      },
      {
        title: localizeFilter('Menu_Planning'),
        url: '/planning',
        icon: 'fas fa-list-ul',
      },
      {
        title: localizeFilter('Menu_Goals'),
        url: '/goals',
        icon: 'fas fa-coins',
      },
      {
        title: localizeFilter('Menu_NewRecord'),
        url: '/record',
        icon: 'fas fa-edit',
      },
      {
        title: localizeFilter('Menu_Category'),
        url: '/categories',
        icon: 'fas fa-address-card',
      },
    ],
  }),
}
</script>

<style scoped lang="scss">
.router-link {
  text-transform: uppercase;

  i {
    align-self: center;
  }
}
</style>
