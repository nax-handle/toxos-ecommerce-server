// import { Test, TestingModule } from '@nestjs/testing';
// import { CategoryController } from './category.controller';
// import { CategoryService } from './category.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CreateBranchDto } from './dto/create-branch.dto';
// import { UpdateBranchDto } from './dto/update-branch.dto';

// describe('CategoryController', () => {
//   let controller: CategoryController;
//   let service: CategoryService;

//   const mockCategoryService = {
//     create: jest.fn().mockImplementation((dto) => ({
//       id: '1',
//       ...dto,
//     })),
//     createBranch: jest.fn().mockImplementation((dto) => ({
//       id: '1',
//       ...dto,
//     })),
//     findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Category 1' }]),
//     findOne: jest
//       .fn()
//       .mockImplementation((id) =>
//         Promise.resolve({ id, name: `Category ${id}` }),
//       ),
//     update: jest
//       .fn()
//       .mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
//     remove: jest.fn().mockResolvedValue({ deleted: true }),
//     removeBranch: jest.fn().mockResolvedValue({ deleted: true }),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CategoryController],
//       providers: [{ provide: CategoryService, useValue: mockCategoryService }],
//     }).compile();

//     controller = module.get<CategoryController>(CategoryController);
//     service = module.get<CategoryService>(CategoryService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   // ✅ Test create category
//   it('should create a category', async () => {
//     const dto: CreateCategoryDto = { name: 'New Category' };
//     expect(await controller.create(dto)).toEqual({
//       id: '1',
//       name: 'New Category',
//     });
//     expect(service.create).toHaveBeenCalledWith(dto);
//   });

//   // ✅ Test create branch
//   it('should create a branch', async () => {
//     const dto: CreateBranchDto = { name: 'New Branch', categoryId: '1' };
//     expect(await controller.createBranch('1', dto)).toEqual({
//       id: '1',
//       name: 'New Branch',
//       categoryId: '1',
//     });
//     expect(service.createBranch).toHaveBeenCalledWith(dto);
//   });

//   // ✅ Test find all categories
//   it('should return an array of categories', async () => {
//     expect(await controller.findAll()).toEqual([
//       { id: '1', name: 'Category 1' },
//     ]);
//     expect(service.findAll).toHaveBeenCalled();
//   });

//   // ✅ Test find one category
//   it('should return a category by ID', async () => {
//     expect(await controller.findOne('1')).toEqual({
//       id: '1',
//       name: 'Category 1',
//     });
//     expect(service.findOne).toHaveBeenCalledWith('1');
//   });

//   // ✅ Test update category
//   it('should update a category', async () => {
//     const dto: UpdateCategoryDto = { name: 'Updated Category' };
//     expect(await controller.update('1', dto)).toEqual({
//       id: '1',
//       name: 'Updated Category',
//     });
//     expect(service.update).toHaveBeenCalledWith('1', dto);
//   });

//   // ✅ Test delete category
//   it('should delete a category', async () => {
//     expect(await controller.remove('1')).toEqual({ deleted: true });
//     expect(service.remove).toHaveBeenCalledWith('1');
//   });

//   it('should delete a branch', async () => {
//     expect(await controller.removeBranch('1', { branchId: '2' })).toEqual({
//       deleted: true,
//     });
//     expect(service.removeBranch).toHaveBeenCalledWith('2');
//   });
// });
