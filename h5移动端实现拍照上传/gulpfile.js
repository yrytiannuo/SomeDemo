var gulp = require('gulp');
var runSequence = require('run-sequence');
var fileinclude  = require('gulp-file-include');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var del = require('del');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var htmlmini = require('gulp-html-minify');

//定义csc/js/html源文件路径
var cssSrc = 'src/assets/style/*.css'
var jsSrc = 'src/controller/*.js';
var htmlSrc = 'src/static/*.html';
//修改版本号css/js/html的输出目录
var cssDist = 'dist/assets/style'
var jsDist = 'dist/controller';
var htmlDist = 'dist/static';

// 构建前先删除dist文件里的旧版本
gulp.task('del',function () {
    del('dist');
})

//“src/a.js”：指定具体文件；
// “*”：匹配所有文件    例：src/*.js(包含src下的所有js文件)；
// “**”：匹配0个或多个子文件夹    例：src/**/*.js(包含src的0个或多个子文件夹下的js文件)；
// “{}”：匹配多个属性    例：src/{a,b}.js(包含a.js和b.js文件)  src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；
// “!”：排除文件    例：!src/a.js(不包含src下的a.js文件)；
gulp.task('copy',  function() {
    return gulp.src(['src/**/*','!src/static/**','!src/controller/*','!src/assets/style/*'],{ base: 'src' })
        .pipe(gulp.dest('dist'))
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function () {
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(csso())   //压缩css
        .pipe(gulp.dest(cssDist))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function () {
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(uglify())                         // 压缩js
        .pipe(gulp.dest(jsDist))  //生成带版本号的文件
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});


//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', htmlSrc])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))                         //加入header/footer
        .pipe(revCollector())
        .pipe(htmlmini())                       // 压缩html
        .pipe(gulp.dest(htmlDist));
});


//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['del'],
        ['copy'],
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});