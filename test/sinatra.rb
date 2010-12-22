require "rubygems"
require "sinatra"

set :public, File.expand_path('../..', __FILE__)
set :static, true
set :method_override, true

get "/favicon.ico" do
end

get "/*" do
  path = settings.public + '/' + params[:splat].first
  
  files = Dir.new(path).select do |file|
    unless file =~ /^\./
      true if File.directory?(path + '/' + file) || file =~ /\.(html|js)$/
    end
  end
  
  str = '<!DOCTYPE html>'
  str << '<html>'
  str << '<body>'
  str << '<ul>'
  
  files.sort.each do |file|
    path = '/'
    path += params[:splat].first
    path += '/' unless path == '/'
    path += file
    str << '  <li><a href="' + path + '">' + file + '</a></li>'
  end
  
  str << '</ul>'
  str << '<body>'
  str << '</html>'
  str
end
