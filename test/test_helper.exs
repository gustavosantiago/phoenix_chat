ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Mychat.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Mychat.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Mychat.Repo)

