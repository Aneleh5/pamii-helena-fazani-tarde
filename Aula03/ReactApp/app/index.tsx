import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type Task = {
  text: string;
  image?: string | null; // Permite null
  completed: boolean;
  id: string;
};

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [taskImage, setTaskImage] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const addTask = () => {
    if (taskText.trim() || taskImage) {
      if (editingTaskId) {
        setTasks(tasks.map(task => 
          task.id === editingTaskId ? { ...task, text: taskText, image: taskImage } : task
        ));
        setEditingTaskId(null);
      } else {
        setTasks([...tasks, { text: taskText, image: taskImage, completed: false, id: Date.now().toString() }]);
      }
      setTaskText('');
      setTaskImage(null);
    } else {
      Alert.alert('Atenção', 'Você precisa inserir uma tarefa ou imagem.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTaskImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setTaskImage(null);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskText(task.text);
    setTaskImage(task.image || null);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa"
          value={taskText}
          onChangeText={setTaskText}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {taskImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: taskImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <Ionicons name="trash-outline" size={24} color="#E57373" />
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>{editingTaskId ? 'Editar Tarefa' : 'Adicionar Tarefa'}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Pendentes</Text>
      <FlatList
        data={activeTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskContainer} onPress={() => toggleTaskCompletion(item.id)}>
            {item.completed ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
            )}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.taskImage} />
            )}
            <Text style={[styles.taskText, item.completed ? styles.completedTask : null]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => { removeTask(item.id); }}>
              <Ionicons name="trash-outline" size={24} color="#E57373" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startEditingTask(item)} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="#2196F3" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Concluídas</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskContainer} onPress={() => toggleTaskCompletion(item.id)}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.taskImage} />
            )}
            <Text style={[styles.taskText, styles.completedTask]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#E57373" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startEditingTask(item)} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="#2196F3" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2C3E50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    padding: 15,
    marginRight: 10,
    borderRadius: 25,
    fontSize: 18,
    backgroundColor: '#ffffff',
    color: '#2C3E50',
  },
  addButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 25,
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B0BEC5',
  },
  taskText: {
    flex: 1,
    fontSize: 18,
    color: '#2C3E50',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#B0BEC5',
  },
  editButton: {
    marginLeft: 10,
  },
  taskImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
