var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

//const server = browserSync.create();

var config = {
  jsLibs : ['node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/angular/angular.js',
             'node_modules/angular-ui-router/release/angular-ui-router.js',
             'node_modules/angular-md5/angular-md5.js',
             'node_modules/firebase/firebase.js',
             'node_modules/angularfire/dist/angularfire.js'],

  bootstrapCss:'node_modules/bootstrap/dist/css/bootstrap.min.css',
  scripts : ['app/app.js', '!app/main/*.js', 'app/**/*.js' ]
}

gulp.task('buildJsLib',function(){
  gulp.src(config.jsLibs)
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('app/main',{overwrite:true}))
})

gulp.task('buildScripts',function(){
  gulp.src(config.scripts)
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('app/main',{overwrite:true}))
})

gulp.task('reload',function(done){
  browserSync.reload();
  done();
})

gulp.task('default', function() {
  browserSync.init({
    server: {
        baseDir: "./app"
    }
  });
  gulp.watch(['!app/main/*.js','app/**/*.js'], ['buildScripts','reload']);
  gulp.watch(['app/**/*.html','app/**/*.css'],['reload'])
});
