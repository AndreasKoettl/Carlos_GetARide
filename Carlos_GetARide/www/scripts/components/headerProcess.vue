<template>
    <header>
        <a v-on:click="goBack" id="back"><img src="/carlos/Carlos_GetARide/www/images/icons/back.svg" /></a>
    <div>
        <h3>{{ title }}</h3>
        <div id="page-navigation">
            <div class="circle" id="circle-wohin"></div>
            <div class="circle" id="circle-wiederholend"></div>
            <div class="circle" id="circle-wann"></div>
            <div class="circle" id="circle-merkmale"></div>
            <div class="circle" id="circle-personen"></div>
            <div class="circle" id="circle-preis"></div>
        </div>
    </div>
</header>
</template>

<script>

export default = {
    props: ['title'],    
    methods: {
        goBack: function () {
            history.back();
        }
    },
    mounted: function () {
        let path = document.location.pathname.match(/[^\/]+$/)[0];
        let id = path.slice(0, -5);
        document.querySelector('#circle-' + id).className += (' circle-active');
    }
}
</script>

<style scoped>

</style>