puts "abc\r".chomp.inspect         # => "abc"
puts "abc\n".chomp.inspect         # => "abc"
puts "abc\r\n".chomp.inspect       # => "abc"
puts "abc\n\r".chomp.inspect       # => "abc\n"
puts "тест\r\n".chomp.inspect      # => "тест"
puts "こんにちは\r\n".chomp.inspect  # => "こんにちは"

puts "abc\n\n\n".chomp('').inspect           # => "abc"
puts "abc\r\n\r\n\r\n".chomp('').inspect     # => "abc"
puts "abc\n\n\r\n\r\n\n\n".chomp('').inspect # => "abc"
puts "abc\n\r\n\r\n\r".chomp('').inspect     # => "abc\n\r\n\r\n\r"
puts "abc\r\r\r".chomp('').inspect           # => "abc\r\r\r"

puts 'abcd'.chomp('d').inspect  # => "abc"
puts 'abcdd'.chomp('d').inspect # => "abcd"