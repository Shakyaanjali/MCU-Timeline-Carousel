Vue.component("embla", {
    props: { options: Object },
    template: "#tpl__embla",
    
    methods: {
      init() {
        this.$embla = EmblaCarousel(this.$el, this.options);
      },
      
      api() {
        return this.$embla;
      }
    },
    
    mounted() {
      this.init();
    },
  });
  
  Vue.component("carousel", {
    props: { movies: Object, options: Object, current: Number },
    template: "#tpl__carousel",
    
    methods: {
      setCurrent() {
        this.$emit('set-current', this.$refs.embla.api().selectedScrollSnap());
      },
      
      setScrollDirection() {
        if (this.$refs.embla.api().selectedScrollSnap() > this.$refs.embla.api().previousScrollSnap()) {                
         return this.$emit('scroll-direction', 'scroll-next');
        }
        
        this.$emit('scroll-direction', 'scroll-prev');
      },
      
      scrollTo(target) {
        this.$refs.embla.api().scrollTo(target);
      },
      
      scrollPrev() {
        this.$refs.embla.api().scrollPrev();
      },
      
      scrollNext() {
        this.$refs.embla.api().scrollNext();
      },
      
      canScrollPrev() {
        return this.$refs.embla ? this.$refs.embla.api().canScrollPrev() : false;
      },
      
      canScrollNext() {
        return this.$refs.embla ? this.$refs.embla.api().canScrollNext() : true;
      },
      
      handleUpdate() {
        this.setCurrent();
        this.setScrollDirection();
      },
    },
    
    mounted() {
      this.$refs.embla.api().on('select', this.handleUpdate);
    }
  });
  
  Vue.component("carousel-item", {
    props: { title: String },
    template: "#tpl__carousel-item",
    
    methods: {
      handleModal() {
        this.$emit('trigger-modal');
      }
    }
  });
  
  
  Vue.component("carousel-image", {
    props: { backdrop: String, size: String },
    template: "#tpl__carousel-image",
    
    computed: {
      src() {
        return `https://image.tmdb.org/t/p/w${this.size}${this.backdrop}`;
      }
    }
  });
  
  Vue.component("modal", {
    props: { id: Number },
    template: "#tpl__modal",
    
    data() {
      return {
        src: null
      }
    },
    
    methods: {
      fetchVideo() {
        fetch(`https://api.themoviedb.org/3/movie/${this.id}/videos?api_key=${userKey}&language=en-US`)
          .then(res => res.json())
          .then(data => {
            setTimeout(() => {
              this.src = `https://www.youtube.com/embed/${data.results[0].key}?autoplay=1&mute=1`;
            }, 400);
          })
          .catch(err => err);
      },
      
      handleModal() {
        this.$emit('trigger-modal');
      }
    },
    
    mounted() {
      this.fetchVideo();
    }
  });
  
  const app = new Vue({
    el: "#app",
    
    data: {
      carouselOptions: { speed: 25 },
      current: 0,
      movies: [],
      scrollDirection: null,
      showModal: false,
      loading: true,
      error: false
    },
    
    methods: {
      handleScrollDirection(value) {
        this.scrollDirection = value;
      },
      
      handleCurrentSlide(value) {
        this.current = value;
      },
      
      handleModal() {
        this.showModal = !this.showModal;
      },
      
      fetchMovieList() { 
        this.loading = true;
        fetch(`https://api.themoviedb.org/3/list/142235?api_key=${userKey}&language=en-US`)
          .then(res => res.json())
          .then(data => this.movies = data.items)
          .then(this.loading = false)
          .catch(err => this.error);
      },
    },
    
    mounted() {
      this.fetchMovieList();
    }
  });
  