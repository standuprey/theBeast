# jsmodules.rb
require 'rubygems'
require 'sinatra'

set :page_count, 5

get '/' do
  erb :example1
end

get '/example1' do
  erb :example1
end

get '/example2' do
  erb :example2
end

get '/example3' do
  erb :example3
end

get '/example4' do
  erb :example4
end

get '/example5' do
  erb :example5
end

get '/example5/:color' do
  erb :example5
end
