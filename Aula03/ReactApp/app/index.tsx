import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type Task = {
  text: string;
  completed: boolean;
  id: string;
};

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');

  // Função para adicionar uma nova tarefa
  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { text: taskText, completed: false, id: Date.now().toString() }]);
      setTaskText('');
    }
  };

  // Função para marcar uma tarefa como concluída
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Função para remover uma tarefa
  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Separar tarefas ativas e concluídas
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      
      {/* Entrada para nova tarefa */}
      <TextInput
        style={styles.input}
        placeholder="Adicionar nova tarefa"
        value={taskText}
        onChangeText={setTaskText}
      />
      <Button title="Adicionar Tarefa" onPress={addTask} />

      {/* Lista de Tarefas Ativas */}
      <Text style={styles.sectionTitle}>Tarefas Pendentes</Text>
      <FlatList
        data={activeTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Text style={styles.taskText}>{item.text}</Text>
            </TouchableOpacity>
            <Button title="Remover" color="red" onPress={() => removeTask(item.id)} />
          </View>
        )}
      />

      {/* Lista de Tarefas Concluídas */}
      <Text style={styles.sectionTitle}>Tarefas Feitas</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Text style={[styles.taskText, styles.completedTask]}>{item.text}</Text>
            </TouchableOpacity>
            <Button title="Remover" color="red" onPress={() => removeTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  taskText: {
    fontSize: 18,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
