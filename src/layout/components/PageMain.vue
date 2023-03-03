<template>
  <router-view :key="key" />
  <!-- <keep-alive :include="cachedViews"> -->
  <!-- </keep-alive> -->
  <!-- <transition name="fade-transform" mode="out-in"> -->
  <!-- </transition> -->
</template>

<script>
export default {
  name: "PageMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped></style>
