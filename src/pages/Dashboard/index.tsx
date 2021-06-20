import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      console.log('teste foods', response.data);
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  const fetchFoods = async (): Promise<void> => {
    const response = await api.get('/foods');
    setFoods(response.data);
  };

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      console.log('resposta do handleAddFood', response.data);
      setFoods([...foods, response.data]);
      toast.success('Prato criado');
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'available'>,
  ): Promise<void> {
    console.log('comidda', food);
    const response = await api.put(
      `/foods/${food.id ? food.id : editingFood.id}`,
      { ...food },
    );
    setFoods(
      foods.map(comida =>
        comida.id === editingFood.id ? { ...response.data } : comida,
      ),
    );
    toast.success('Prato atualizado');
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`foods/${id}`);
    setFoods(foods.filter(food => food.id !== id));
    toast.success('Prato deletado');
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    toggleEditModal();
    setEditingFood(food);
  }

  useEffect(() => {
    console.log('toggleEditModal', toggleEditModal);
  }, [toggleEditModal]);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleUpdateFood={handleUpdateFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
