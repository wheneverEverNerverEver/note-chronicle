---
layout: post
title: "关于 Jekyll 的初步使用"
date: 2019-05-19 09:52:00 +0800
categories: tool
summary: "使用 GitHub pages 过程中，对于博客这类网站更合适的是一种方式是借用 jekyll 。这里记录了一些初步使用 Jekyll 时需要知道的内容...."
---

使用 GitHub pages 过程中，对于博客这类网站更合适的是一种方式是借用 jekyll 。

Jekyll 更关注博客的内容，之后的文件更新只需要更新目录下的某个文件夹里的内容即可（即`_post`）。

#### 环境安装

关于 Jekyll 的环境及安装大致如下：

1. Jekyll 的运行环境需要 ruby ，详细的安装可以查看链接：[环境准备][jekyll-env-install]

2. gem 可用之后， 安装 Jekyll ：`gem install jekyll bundler`

3. 然后命令行输入：`jekyll new myblog` ，创建新的 Jekyll 项目在 `./myblog` 中

4. 切换到 `./myblog` 中：` cd myblog`

5. `bundle exec jekyll serve` 或者 `jekyll serve` 运行你的 Jekyll，成功后就可访问到 http://localhost:4000

#### 安装项目依赖

`bundle init` 是在目录下没有 `Gemfile`文件的情况下生成该文件
如果需要寻找依赖的话，可以在 Ruby 社区的 Gem 托管服务 [RubyGems.org][jekyll-more] 中找到依赖，查看版本号等
知道你需要的依赖是什么后，可以在 `./Gemfile` 文件的中加入你的依赖信息
{% raw %}

```
  group :jekyll_plugins do
    gem "jekyll-feed", "~> 0.6"
    gem "jekyll-paginate","~> 1.0"
  end
```

{% endraw %}
然后命令行执行 `bundle install` 安装依赖，安装成功后再修改 `_config.yml` 文件里相应的内容即可

#### 主题

当你按以上的成功访问到 localhost:4000 后，你可能会想更改主题或者在这个主题上修改出你要的效果

如果你是想更换一个主题，Jekyll 官网上推荐的网站是：[主题][jekyll-theme] ，找到你想要的主题之后，在你的 `./Gemfile` 文件中 `gem "minima", "~> X.0"` 的地方，将安装时默认的主题 `"minima", "~> X.0"`信息，换成你要的，然后通过命令行 `bundle install` 安装主题，再然后在目录下的 `_config.yml`文件中原先默认的 `theme: minima` 改成你安装了的主题，之后运行项目即可。

如果你要在主题上作出自己的修改，你需要用你项目中要修改的内容覆盖掉主题中默认的内容，这时，你可能需要知道主题的文件路径查看它的文件结构，你可以通过命令行 `bundle show XXXXX`找到主题的路径，在理解了主题下的每个目录的意义和文件的作用之后，你就可以在你的项目下放相同的目录结构和文件命名，这样你的修改就可以在页面中展现了。

#### 分页

根据安装项目依赖里的方法，将**jekyll-paginate**安装并在 `_config.yml` 中设置分页信息：

paginate: 5
paginate_path: "/blog/page:num/"

更多的分页信息配置，查看[文档][jekyll-pagination]

然后如下使用即可

{% raw %}

```
 <!-- Pagination links -->
 <div class="pagination">
   {% if paginator.previous_page %}
     <a href="{{ paginator.previous_page_path }}" class="previous">
       Previous
     </a>
   {% else %}
     <span class="previous">Previous</span>
   {% endif %}
   <span class="page_number ">
     Page: {{ paginator.page }} of {{ paginator.total_pages }}
   </span>
   {% if paginator.next_page %}
     <a href="{{ paginator.next_page_path }}" class="next">Next</a>
   {% else %}
     <span class="next ">Next</span>
   {% endif %}
 </div>
```

{% endraw %}

#### 博客发布

在项目的 `_posts` 目录下添加 `YYYY-MM-DD-name-of-post.md`这类命名的文件：

> To add new posts, simply add a file in the `_posts` directory that follows the convention and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

#### 更多

在 Jekyll 中使用了 [Liquid][more] 模版
比如日期的格式:
{% raw %}

```
  {{ article.published_at | date: "%a, %b %d, %y" }}
  {{ "now" | date: "%Y-%m-%d %H:%M" }}
```

{% endraw %}

[jekyll-env-install]: https://jekyllrb.com/docs/installation/
[jekyll-theme]: https://rubygems.org/search?utf8=%E2%9C%93&query=jekyll-theme
[jekyll-pagination]: https://jekyllrb.com/docs/pagination/
[jekyll-more]: https://rubygems.org/
[more]: https://shopify.github.io/liquid/
